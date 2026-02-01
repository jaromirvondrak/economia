import { describe, expect, it, vi } from "vitest";
import { rateLimit } from "../src/http/middleware/rateLimit";
import { Request, Response, NextFunction } from "express";

describe("rateLimit middleware", () => {
  it("propustí požadavky do limitu", () => {
    // Použijeme unikátní IP, aby se nepletla s dalšími testy.
    const req = { ip: "10.0.0.1" } as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    // Prvních 60 requestů musí projít.
    for (let i = 0; i < 60; i += 1) {
      rateLimit(req, res, next);
    }

    expect(next).toHaveBeenCalledTimes(60);
  });

  it("vrátí 429 po překročení limitu", () => {
    // Jiná IP, aby měl test čistý „bucket“.
    const req = { ip: "10.0.0.2" } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    // 61. request musí být zablokován.
    for (let i = 0; i < 61; i += 1) {
      rateLimit(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalled();
  });
});
