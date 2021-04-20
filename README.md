## Socket Service

- Responsible for chat messages and communication with `Stock Service`.

```
Environment Variables:
AMQP_URL= URL to RabbitMQ (amqp://user:pass@host:port)
```

In this moment, RabbitMQ should be running. The `.yml` to use with docker-compose is available in the root directory, folder `resources`.

### How to use

`npm install`
or 
`yarn install`

And
`yarn dev`
or
`npm run dev`