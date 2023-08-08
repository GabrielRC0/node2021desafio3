const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repositories[repoIndex];

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repository } = request;
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (!repoIndex) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const updatedRepo = {
    ...repository, // Copy the existing repository's properties
    title,
    url,
    techs,
  };

  repositories[repoIndex] = updatedRepo;

  return response.status(200).json(updatedRepo);
});


app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (!repositoryIndex ) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({ likes });
});

module.exports = app;
