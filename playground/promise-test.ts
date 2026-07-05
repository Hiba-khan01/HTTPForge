function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`${ms}ms timer finished`);
            resolve();
        }, ms);
    });
}

async function main() {
    console.time("Total");

    const p1 = wait(3000);
    const p2 = wait(2000);
    const p3 = wait(1000);

    await p1;
    await p2;
    await p3;

    console.timeEnd("Total");
}

main();