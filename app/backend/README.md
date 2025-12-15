# Linkchain Backend


## Getting Started
```shell
cd app/backend
uv sync
uv run fastapi dev
```

## Deployment Instructions
```shell
docker build -t fastapi-app .
docker run -p 8000:80 fastapi-app

```
