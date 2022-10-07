import { expect, test } from "@oclif/test";

describe("app_key export (missing parameters)", () => 
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

    test.stdout({print: false})
        .command(["export", "app_key"])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("Missing")
                .and.to.contain("id_number");
        })
        .it("throws error without 'id_number'");

    test.stdout({print: false})
        .command(["export", "app_key", "1" ])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("Missing")
                .and.to.contain("-R, --ryder_port");
        })
        .it("throws error without --ryder-port flag");

    test.stdout({print: false})
        .command(["export", "app_key", "1", "-R", "MARVIN" ])
        .catch(err => 
        {
            expect(err.message)
                .to.contain("RESPONSE_ERROR_APP_DOMAIN_INVALID");
        })
        it("throws error for missing/invalid app domain");
});

// describe("app_key export (missing id_number)", () => 
// {
    
// });

// describe("app_key export (missing port)", () => 
// {
    
// });

// describe("app_key export (missing app domain)", () => 
// {
    
// });

describe("app_key export", () => 
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
        .command(["export", "app_key", "1", "https://Ryder.io", "-R", "MARVIN"])
        .it('should export app_key for the given domain', (ctx) => 
        {
            expect(ctx.stdout).to.contain("68747470733a2f2f52796465722e696f2c314475525937464a68747244317a583779414646664d503571627876515777444162");
        });

    test.stdout({print: false})
        .retries(3)
        .command(["test-normal-operation", "-R", "MARVIN"])
        .it('should return test-normal-operation command validation (1)', (ctx) => 
        {
            expect(ctx.stdout).to.contain('1');
        });
});
