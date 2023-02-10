# SKF DASHBOARD

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |
| `npm run format`       | Formats your code                                |
| `npm run lint`         | Lints your code                                  |

## Kind

https://kind.sigs.k8s.io/docs/user/quick-start

```sh
kind delete cluster &&
kind create cluster &&
kind get clusters &&
kubectl cluster-info --context kind-kind 
```

## RabbitMQ

https://www.rabbitmq.com/download.html

```sh
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
```

OR

```sh
cd ./k8s && docker-compose up
```

https://registry.hub.docker.com/_/rabbitmq/#:~:text=and%20password%20of-,guest%20/%20guest,-%2C%20you%20can%20do
> login is 
> * username: **guest** 
> * password: **guest**

## Deno Kubernetes

```sh
pnpm deno:kubernetes
```

## Database Migration

Database migration is now complete, I used https://stackoverflow.com/a/34726143

> ^ But you will need to install the `sqlite3` & `postgres` gems (yes, Ruby gems)


```sh
gem install sqlite3 &&
gem install postgres &&
gem install sequel
```

> I used https://stackoverflow.com/a/46723784 for debugging the `Sequel::AdapterNotFound: LoadError: cannot load such file -- sqlite3`
>

## Ingress / Sub-domain / Port Deploy

> If you haven't previously added the repo:
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx &&
helm repo update &&

helm install ingress-nginx ingress-nginx/ingress-nginx \
    --set rbac.create=true \
    --set controller.publishService.enabled=true \
    --set controller.service.externalTrafficPolicy=Local \
    --set controller.setAsDefaultIngress=true \
    --set controller.extraArgs.default-ssl-certificate="default/securityknowledgeframework-labs.org"