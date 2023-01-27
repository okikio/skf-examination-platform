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

kind delete cluster &&
kind create cluster &&
kind get clusters &&
kubectl cluster-info --context kind-kind 

## RabbitMQ

https://www.rabbitmq.com/download.html

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management

https://registry.hub.docker.com/_/rabbitmq/#:~:text=and%20password%20of-,guest%20/%20guest,-%2C%20you%20can%20do
> login is 
> * username: guest 
> * password: guest 