#!/bin/bash
args=("$@")
CONTAINER_IDS=$(docker ps | cut -d" " -f1 | tail -n +2)
cp /etc/hosts /tmp/hosts.bak
cp /etc/hosts /tmp/hosts.tmp
echo "etc/hosts backup saved to /tmp/hosts.bak"

for i in $CONTAINER_IDS; do
    if [[ ${args[0]} == '' ]]; then
        ALL_IPS=$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}},{{end}}' $i)
        IFS=',' read -r -a ALL_IPS <<< "$ALL_IPS"
    else
        ALL_IPS=(${args[0]})
    fi

    for IP in "${ALL_IPS[@]}"
    do
        CONTAINER_NAME=$(docker inspect --format '{{ .Name }}' $i | tail -c +2)
        SERVICE_NAME=$(docker inspect $i | grep "com.docker.compose.service" | cut -d'"' -f4)
        VIRTUAL_HOSTS=$(docker inspect $i | egrep -i 'NGINX_HOST|VIRTUAL_HOST|VHOST' | cut -d"=" -f 2 | grep -o '[A-Za-z\.,]*' | head -n1 | sed 's/,/ /g')
        DOCKER_HOST_NAME=$(docker inspect $i | grep -i '"Hostname":' | cut -d ":" -f2 | sed 's/[^A-Za-z0-9_-]//g')
        if [[ "$IP" != "" ]]; then
            cat /tmp/hosts.tmp | grep -v "$CONTAINER_NAME" > /tmp/hosts2.tmp
            cat /tmp/hosts.tmp | grep -v "$VIRTUAL_HOSTS" > /tmp/hosts2.tmp
            cat /tmp/hosts.tmp | grep -v "$DOCKER_HOST_NAME" > /tmp/hosts2.tmp
            cat /tmp/hosts.tmp | egrep -v "$IP\s+" > /tmp/hosts2.tmp
            mv /tmp/hosts2.tmp /tmp/hosts.tmp
            echo "$IP $SERVICE_NAME $CONTAINER_NAME $VIRTUAL_HOSTS $DOCKER_HOST_NAME" | tee -a /tmp/hosts.tmp
        fi
    done
done;

sudo cp /tmp/hosts.tmp /etc/hosts
