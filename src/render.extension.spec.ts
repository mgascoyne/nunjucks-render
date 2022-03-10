import { Environment, runtime } from 'nunjucks';
import { RenderExtension } from './render.extension';
import Mock = jest.Mock;
import SafeString = runtime.SafeString;

/**
 * Tests for Nunjucks Render Extension.
 */

// Mocking Nunjucks
jest.mock('nunjucks');

describe('RenderExtension', () => {
  let extension: RenderExtension = null;
  const environmentMock: Environment = new Environment();

  /**
   * SetUp test environment.
   */
  beforeEach(() => {
    extension = new RenderExtension({
      environment: environmentMock,
      templatePath: '/vfs/templates',
    });
  });

  /**
   * Test that extension supports all suggested types.
   */
  it('supports suggested tags', () => {
    expect(extension.tags).toContain('render');
  });

  /**
   * Test that the parser works correctly.
   */
  it('parses correctly', () => {
    const nextTokenMock = jest.fn(() => {
      return { value: 'token_value' };
    });
    const parseSignatureMock = jest.fn(() => ['arg1', 'arg2']);
    const advanceAfterBlockEndMock = jest.fn();
    const parserMock = class {
      nextToken = nextTokenMock;
      parseSignature = parseSignatureMock;
      advanceAfterBlockEnd = advanceAfterBlockEndMock;
    };

    const callExtensionMock = class {};

    const nodesMock = class {
      CallExtension = callExtensionMock;
    };

    const lexerMock = jest.fn();

    expect(
      extension.parse(new parserMock(), new nodesMock(), lexerMock),
    ).toBeInstanceOf(callExtensionMock);

    expect(nextTokenMock).toHaveBeenCalled();
    expect(parseSignatureMock).toHaveBeenCalledWith(null, true);
    expect(advanceAfterBlockEndMock).toHaveBeenCalledWith('token_value');
  });

  /**
   * Test for rendering template correctly.
   */
  it('renders a template correctly', () => {
    jest
      .spyOn(environmentMock, 'render')
      .mockImplementation((template: string, data: { testData: string }) => {
        return `Parameter testData: ${data.testData}`;
      });

    // Mocking SafeString (necessary, because entire Nunjucks module is auto-mocked by Jest)
    (SafeString as unknown as Mock<SafeString>).mockImplementation((data) => {
      return {
        val: data,
        length: -1,
        valueOf: jest.fn(),
        toString: jest.fn(),
      };
    });

    expect(
      extension.render({}, 'template_to_render.njk', { testData: 'Test' }).val,
    ).toEqual('Parameter testData: Test');
  });

  /**
   * Test for rendering template correctly with context.
   */
  it('renders a template correctly with context', () => {
    jest
      .spyOn(environmentMock, 'render')
      .mockImplementation(
        (
          template: string,
          data: { testData: string; context: { contextVar: string } },
        ) => {
          return `Parameter testData: ${data.testData}, Context property: ${data.context.contextVar}`;
        },
      );

    // Mocking SafeString (necessary, because entire Nunjucks module is auto-mocked by Jest)
    (SafeString as unknown as Mock<SafeString>).mockImplementation((data) => {
      return {
        val: data,
        length: -1,
        valueOf: jest.fn(),
        toString: jest.fn(),
      };
    });

    expect(
      extension.render(
        { ctx: { contextVar: 'contextValue' } },
        'template_to_render.njk',
        { testData: 'Test' },
        { includeContext: true },
      ).val,
    ).toEqual('Parameter testData: Test, Context property: contextValue');
  });
});
