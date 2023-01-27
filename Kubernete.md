## Kind

https://kind.sigs.k8s.io/docs/user/quick-start

https://www.rabbitmq.com/download.html

kind delete cluster &&

kind create cluster &&
 
kind get clusters &&

kubectl cluster-info --context kind-kind 

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
