import * as Path from 'path'
import * as FSE from 'fs-extra'
import { mkdirSync } from './temp'
import klawSync, { Item } from 'klaw-sync'
import { Repository } from '../../src/models/repository'
import { exec } from 'dugite'
import { makeCommit, switchTo } from './repository-scaffolding'
import { writeFile } from 'fs-extra'
import { git } from '../../src/lib/git'

/**
 * Set up the named fixture repository to be used in a test.
 *
 * @returns The path to the set up fixture repository.
 */
export async function setupFixtureRepository(
  repositoryName: string
): Promise<string> {
  const testRepoFixturePath = Path.join(
    __dirname,
    '..',
    'fixtures',
    repositoryName
  )
  const testRepoPath = mkdirSync('desktop-git-test-')
  await FSE.copy(testRepoFixturePath, testRepoPath)

  await FSE.rename(
    Path.join(testRepoPath, '_git'),
    Path.join(testRepoPath, '.git')
  )

  const ignoreHiddenFiles = function (item: Item) {
    const basename = Path.basename(item.path)
    return basename === '.' || basename[0] !== '.'
  }

  const entries = klawSync(testRepoPath)
  const visiblePaths = entries.filter(ignoreHiddenFiles)
  const submodules = visiblePaths.filter(
    entry => Path.basename(entry.path) === '_git'
  )

  for (const submodule of submodules) {
    const directory = Path.dirname(submodule.path)
    const newPath = Path.join(directory, '.git')
    await FSE.rename(submodule.path, newPath)
  }

  await claimOwnershipOfFixture(testRepoPath)

  return testRepoPath
}

/**
 * Node 22 (which ships in Electron 39) changed `fs.copyFile` so that a process
 * running as root preserves the *source* file's ownership instead of taking
 * ownership itself. Node 20 (Electron 32) took ownership.
 *
 * Our CI runs the packaging container as root while the checkout in
 * /github/workspace is owned by the runner user, so from Electron 39 onwards
 * the copied fixture is owned by that runner user. git then refuses to operate
 * on it with "detected dubious ownership", failing the submodule/diff/status
 * tests.
 *
 * Re-claiming the copy restores the pre-Node-22 invariant that a fixture is
 * owned by whoever created it, rather than suppressing git's ownership check
 * with a `safe.directory` entry (which would also mask genuine ownership bugs).
 */
async function claimOwnershipOfFixture(testRepoPath: string): Promise<void> {
  // chown is a no-op concept on Windows, and only root can hand files between
  // users, so there is nothing to do (and nothing permitted) elsewhere.
  const { getuid, getgid } = process
  if (getuid === undefined || getgid === undefined) {
    return
  }

  const uid = getuid.call(process)
  if (uid !== 0) {
    return
  }
  const gid = getgid.call(process)

  await FSE.chown(testRepoPath, uid, gid)
  for (const entry of klawSync(testRepoPath)) {
    await FSE.lchown(entry.path, uid, gid)
  }
}

/**
 * Initializes a new, empty, git repository at in a temporary location.
 *
 * @returns the new local repository
 */
export async function setupEmptyRepository(): Promise<Repository> {
  const repoPath = mkdirSync('desktop-empty-repo-')
  await exec(['init'], repoPath)

  return new Repository(repoPath, -1, null, false)
}

/**
 * Initializes a new, empty, git repository at in a temporary location with
 * default branch of main.
 *
 * @returns the new local repository
 */
export async function setupEmptyRepositoryDefaultMain(): Promise<Repository> {
  const repoPath = mkdirSync('desktop-empty-repo-')
  await exec(['init', '-b', 'main'], repoPath)

  return new Repository(repoPath, -1, null, false)
}

/**
 * Initialize a new, empty folder that is incorrectly associated with a Git
 * repository. This should only be used to test error handling of the Git
 * interactions.
 */
export function setupEmptyDirectory(): Repository {
  const repoPath = mkdirSync('no-repository-here')
  return new Repository(repoPath, -1, null, false)
}

/**
 * Setup a repository and create a merge conflict
 *
 * @returns the new local repository
 *
 * The current branch will be 'other-branch' and the merged branch will be
 * 'master' in your test harness.
 *
 * The conflicted file will be 'foo'.
 */
export async function setupConflictedRepo(): Promise<Repository> {
  const repo = await setupEmptyRepository()

  const firstCommit = {
    entries: [{ path: 'foo', contents: '' }],
  }

  await makeCommit(repo, firstCommit)

  // create this branch starting from the first commit, but don't checkout it
  // because we want to create a divergent history
  await exec(['branch', 'other-branch'], repo.path)

  const secondCommit = {
    entries: [{ path: 'foo', contents: 'b1' }],
  }

  await makeCommit(repo, secondCommit)

  await switchTo(repo, 'other-branch')

  const thirdCommit = {
    entries: [{ path: 'foo', contents: 'b2' }],
  }
  await makeCommit(repo, thirdCommit)

  await exec(['merge', 'master'], repo.path)

  return repo
}

/**
 * Setup a repository and create a merge conflict
 *
 * @returns the new local repository
 *
 * The current branch will be 'other-branch' and the merged branch will be
 * 'master' in your test harness.
 *
 * The conflicted file will be 'foo'. There will also be uncommitted changes unrelated to the merge in 'perlin'.
 */
export async function setupConflictedRepoWithUnrelatedCommittedChange(): Promise<Repository> {
  const repo = await setupEmptyRepository()

  const firstCommit = {
    entries: [
      { path: 'foo', contents: '' },
      { path: 'perlin', contents: 'perlin' },
    ],
  }

  await makeCommit(repo, firstCommit)

  // create this branch starting from the first commit, but don't checkout it
  // because we want to create a divergent history
  await exec(['branch', 'other-branch'], repo.path)

  const secondCommit = {
    entries: [{ path: 'foo', contents: 'b1' }],
  }

  await makeCommit(repo, secondCommit)

  await switchTo(repo, 'other-branch')

  const thirdCommit = {
    entries: [{ path: 'foo', contents: 'b2' }],
  }
  await makeCommit(repo, thirdCommit)

  await writeFile(Path.join(repo.path, 'perlin'), 'noise')

  await exec(['merge', 'master'], repo.path)

  return repo
}

/**
 * Setup a repository and create a merge conflict with multiple files
 *
 * @returns the new local repository
 *
 * The current branch will be 'other-branch' and the merged branch will be
 * 'master' in your test harness.
 *
 * The conflicted files will be 'foo', 'bar', and 'baz'.
 */
export async function setupConflictedRepoWithMultipleFiles(): Promise<Repository> {
  const repo = await setupEmptyRepository()

  const firstCommit = {
    entries: [
      { path: 'foo', contents: 'b0' },
      { path: 'bar', contents: 'b0' },
    ],
  }

  await makeCommit(repo, firstCommit)

  // create this branch starting from the first commit, but don't checkout it
  // because we want to create a divergent history
  await exec(['branch', 'other-branch'], repo.path)

  const secondCommit = {
    entries: [
      { path: 'foo', contents: 'b1' },
      { path: 'bar', contents: null },
      { path: 'baz', contents: 'b1' },
      { path: 'cat', contents: 'b1' },
    ],
  }

  await makeCommit(repo, secondCommit)

  await switchTo(repo, 'other-branch')

  const thirdCommit = {
    entries: [
      { path: 'foo', contents: 'b2' },
      { path: 'bar', contents: 'b2' },
      { path: 'baz', contents: 'b2' },
      { path: 'cat', contents: 'b2' },
    ],
  }

  await makeCommit(repo, thirdCommit)

  await FSE.writeFile(Path.join(repo.path, 'dog'), 'touch')

  await exec(['merge', 'master'], repo.path)

  return repo
}
/**
 * Setup a repo with a single commit
 *
 * files are `great-file` and `good-file`, which are both added in the one commit
 */
export async function setupTwoCommitRepo(): Promise<Repository> {
  const repo = await setupEmptyRepository()

  const firstCommit = {
    entries: [
      { path: 'good-file', contents: 'wishes it was great' },
      { path: 'great-file', contents: 'wishes it was good' },
    ],
  }
  const secondCommit = {
    entries: [
      { path: 'good-file', contents: 'is great' },
      { path: 'great-file', contents: 'is good' },
    ],
  }

  await makeCommit(repo, firstCommit)
  await makeCommit(repo, secondCommit)
  return repo
}

/**
 * Sets up a local fork of the provided repository
 * and configures the origin remote to point to the
 * local "upstream" repository.
 */
export async function setupLocalForkOfRepository(
  upstream: Repository
): Promise<Repository> {
  const path = mkdirSync('desktop-fork-repo-')
  await git(['clone', '--local', `${upstream.path}`, path], path, 'clone')
  return new Repository(path, -1, null, false)
}
