import { expect, test } from "@oclif/test";

describe("info (missing port)", () => 
{
    test.stdout()
        .command(["info"])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("Missing required flag")
                .and.to.contain("-R, --ryder_port RYDER_PORT");
        })
        .it("throws error without --ryder-port flag");
});

describe("info", () => 
{
    test.stdout({print: false})
        .retries(3)
        .command(["info", "-R", "MARVIN"])
        .it('should return Ryder information', (ctx) => 
        {
            expect(ctx.stdout).to.contain('nitialised Ryder');
        });
});
