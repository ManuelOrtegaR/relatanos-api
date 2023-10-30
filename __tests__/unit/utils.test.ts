import { faker } from "@faker-js/faker";
import { describe, expect, test } from "vitest";
import { encryptPassword, verifyPassword } from "../../app/utils.ts";

describe('Testing utils.ts', () => {
  test('Encrypt and verify password', async () => {
    const password = faker.internet.password()

    const encryptedPassword = await encryptPassword(password)
    expect(encryptedPassword).not.toBe(password)

    const decryptedPassword = await verifyPassword(password, encryptedPassword)
    expect(decryptedPassword).toBeTruthy()

    const decryptedBadPassword = await verifyPassword("badPassword", encryptedPassword)
    expect(decryptedBadPassword).toBeFalsy()
  })
})
