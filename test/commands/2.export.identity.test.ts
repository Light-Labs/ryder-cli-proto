import { expect, test } from "@oclif/test";

describe("identity export (missing what)", () => 
{
    test.stdout({print: false})
        .command(["export"])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("Missing")
                .and.to.contain("what");
        })
        .it("throws error without 'what'");
});

describe("identity export (missing id_number)", () => 
{
    test.stdout({print: false})
        .command(["export", "identity"])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("Missing")
                .and.to.contain("id_number");
        })
        .it("throws error without 'identity_id'");
});

describe("identity export (missing port)", () => 
{
    test.stdout({print: false})
        .command(["export", "identity", "1" ])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("Missing")
                .and.to.contain("-R, --ryder_port");
        })
        .it("throws error without --ryder-port flag");
});

describe("identity export", () => 
{
    test.stdout({print: false})
        .retries(3)
        .command(["test-accept-all", "-R", "MARVIN"])
        .it('should return test-accept-all command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });

    test.stdout({print: false})
        .retries(3)
        .command(["export", "identity", "1", "-R", "MARVIN"])
        .it('should export identity', (ctx) => 
        {
            expect(ctx.stdout).to.contain("02529a1ba626bcac6ccd2d1a0067d527c20ea0c8039631271fcaf184084e1672160000000000000000000000000000000000000000000000000000000000000000")
            .and.to.contain("SP2T758K6T2YRKG9Q0TJ16B6FP5QQREWZSESRS0PY")
            .and.to.contain("ST2T758K6T2YRKG9Q0TJ16B6FP5QQREWZSE0AA71W");
        });

    test.stdout({print: false})
        .retries(3)
        .command(["test-normal-operation", "-R", "MARVIN"])
        .it('should return test-normal-operation command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });
});
