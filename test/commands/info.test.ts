import { expect, test } from "@oclif/test";

describe("info", () => {
    test.stdout()
        .command(["info"])
        .catch(err => {
            expect(err.message)
                .to.contain("Missing required flag")
                .and.to.contain("-R, --ryder_port RYDER_PORT");
        })
        .it("throws error without --ryder-port flag");
});
