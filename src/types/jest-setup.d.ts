// Add support for Jest globals and testing
declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any> extends Function {
      new (...args: Y): T;
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

    type Mocked<T> = {
      [P in keyof T]: T[P] extends (...args: infer A) => infer B
        ? jest.Mock<B, A>
        : T[P];
    } & T;

    function fn<T = any, Y extends any[] = any[]>(): jest.Mock<T, Y>;
    function fn<T = any, Y extends any[] = any[]>(
      implementation?: (...args: Y) => T
    ): jest.Mock<T, Y>;
    
    function spyOn<T extends object, M extends keyof T>(
      object: T,
      method: M
    ): jest.Mock<T[M] extends (...args: any[]) => any ? ReturnType<T[M]> : any>;
    
    function clearAllMocks(): void;
    function resetAllMocks(): void;
    function restoreAllMocks(): void;
  }
  
  interface Matchers<R> {
    toHaveBeenCalled(): R;
    toHaveBeenCalledWith(...args: any[]): R;
    toEqual(expected: any): R;
    toBe(expected: any): R;
    toBeDefined(): R;
    toBeInstanceOf(expected: any): R;
    toHaveLength(expected: number): R;
    toHaveProperty(property: string, value?: any): R;
    toThrow(expected?: string | Error): R;
    resolves: Matchers<Promise<R>>;
    rejects: Matchers<Promise<R>>;
    not: Matchers<R>;
  }
  
  function expect(actual: any): Matchers<void>;
  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
} 