// Type definitions for Jest globals
// These are minimal definitions to get our tests working

interface JestMock<T = any, Y extends any[] = any[]> {
  (...args: Y): T;
  mockImplementation(fn: (...args: Y) => T): this;
  mockImplementationOnce(fn: (...args: Y) => T): this;
  mockReturnValue(value: T): this;
  mockReturnValueOnce(value: T): this;
  mockResolvedValue(value: T): this;
  mockResolvedValueOnce(value: T): this;
  mockRejectedValue(value: any): this;
  mockRejectedValueOnce(value: any): this;
  mockClear(): void;
  mockReset(): void;
  mockRestore(): void;
}

declare global {
  namespace jest {
    function fn<T = any, Y extends any[] = any[]>(): JestMock<T, Y>;
    function fn<T = any, Y extends any[] = any[]>(implementation: (...args: Y) => T): JestMock<T, Y>;
    
    function mock(moduleName: string, factory?: any): void;
    function spyOn<T extends object, M extends keyof T>(object: T, method: M): JestMock<any, any>;
    
    function clearAllMocks(): void;
    function resetAllMocks(): void;
    function restoreAllMocks(): void;
    
    interface Matchers<R> {
      toEqual(expected: any): R;
      toBe(expected: any): R;
      toBeDefined(): R;
      toBeInstanceOf(expected: any): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveProperty(propertyName: string, value?: any): R;
      not: Matchers<R>;
      resolves: Matchers<Promise<R>>;
      rejects: Matchers<Promise<R>>;
    }
  }
  
  function expect<T = any>(actual: T): jest.Matchers<void>;
  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function it(name: string, fn: () => void): void;
} 