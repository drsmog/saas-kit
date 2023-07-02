next dev &
NEXTJS_PROCESS=$!

npm run test-job:dev &
JOB__NAME_PROCESS=$!

stripe listen --forward-to localhost:3000/api/billing/webhook &
STRIPE_FORWARDER=$!

wait $NEXTJS_PROCESS
wait $STRIPE_FORWARDER
wait $JOB__NAME_PROCESS