import express from "express";
import { Octokit } from "@octokit/rest";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// GitHub config
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPO;

app.post("/create-md", async (req, res) => {
  console.log("/create-md route called");
  const { content, folderPath, fileName } = req.body;

  if (!content || !folderPath || !fileName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const filePath = path.posix.join(folderPath, `${fileName}.md`);

  try {
    // Get the current commit's SHA and tree SHA
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: "heads/main",
    });

    const latestCommitSha = refData.object.sha;

    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });

    const treeSha = commitData.tree.sha;

    // Create a new blob with the file content
    const { data: blobData } = await octokit.git.createBlob({
      owner,
      repo,
      content,
      encoding: "utf-8",
    });

    // Create a new tree with the new file
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: treeSha,
      tree: [
        {
          path: filePath,
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        },
      ],
    });

    // Create a new commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: `Add ${filePath}`,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // Update the reference to point to the new commit
    await octokit.git.updateRef({
      owner,
      repo,
      ref: "heads/main",
      sha: newCommit.sha,
    });

    res.json({ message: "File created and pushed to GitHub!", filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
