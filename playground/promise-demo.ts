function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

async function main() {
    console.log("Start");

    await wait(3000);

    console.log("3 seconds later");
}

main();