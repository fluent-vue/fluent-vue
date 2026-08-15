import { getCommitInfo, getPullRequestInfo } from "@changesets/get-github-info";

const GITHUB_SERVER_URL =
  process.env.GITHUB_SERVER_URL || "https://github.com";

const changelogFunctions = {
  getDependencyReleaseLine: async (
    changesets,
    dependenciesUpdated,
    options,
  ) => {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["./changelog-config.mjs", { "repo": "org/repo" }]',
      );
    }
    if (dependenciesUpdated.length === 0) return "";

    const updatedDepenenciesList = dependenciesUpdated.map(
      (dependency) => `  - ${dependency.name}@${dependency.newVersion}`,
    );

    return ["- Updated dependencies:", ...updatedDepenenciesList].join("\n");
  },
  getReleaseLine: async (changeset, _type, options) => {
    if (!options || !options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["./changelog-config.mjs", { "repo": "org/repo" }]',
      );
    }

    let prFromSummary;
    let commitFromSummary;
    const usersFromSummary = [];

    const replacedChangelog = changeset.summary
      .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
        const num = Number(pr);
        if (!isNaN(num)) prFromSummary = num;
        return "";
      })
      .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
        commitFromSummary = commit;
        return "";
      })
      .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
        usersFromSummary.push(user);
        return "";
      })
      .trim();

    const [firstLine, ...futureLines] = replacedChangelog
      .split("\n")
      .map((l) => l.trimEnd());

    const info = await (async () => {
      if (prFromSummary !== undefined) {
        return getPullRequestInfo({
          repo: options.repo,
          pull: prFromSummary,
        });
      }
      const commitToFetchFrom = commitFromSummary || changeset.commit;
      if (commitToFetchFrom) {
        return getCommitInfo({
          repo: options.repo,
          commit: commitToFetchFrom,
        });
      }
      return undefined;
    })();

    const users = usersFromSummary.length
      ? usersFromSummary
          .map(
            (userFromSummary) =>
              `[@${userFromSummary}](${GITHUB_SERVER_URL}/${userFromSummary})`,
          )
          .join(", ")
      : info?.author?.markdownLink;

    // Format: - [#PR](url) Description ([@user](url))
    const prLink = info?.pull ? `${info.pull.markdownLink} ` : "";
    const userSuffix = users ? ` (${users})` : "";

    // Indent continuation lines so they stay part of the list item, but leave
    // blank lines blank — nothing formats the changelog afterwards.
    const rest =
      futureLines.length > 0
        ? `\n${futureLines.map((l) => (l === "" ? "" : `  ${l}`)).join("\n")}`
        : "";

    return `\n\n- ${prLink}${firstLine}${userSuffix}${rest}`;
  },
};

export default changelogFunctions;
