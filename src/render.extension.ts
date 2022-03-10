import { Environment, Extension, runtime } from 'nunjucks';
import * as path from 'path';
import { Context } from 'vm';
import SafeString = runtime.SafeString;

/**
 * Nunjucks Render Extension.
 */
export class RenderExtension implements Extension {
  /**
   * Constructor.
   *
   * @param {RenderExtensionOptions} options - Options for the extension
   */
  constructor(private readonly options: RenderExtensionOptions) {}

  /**
   * Tags this extension supports.
   */
  get tags(): string[] {
    return ['render'];
  }

  /**
   * Parse tag.
   *
   * @param {any} parser - Nunjucks parser
   * @param {any} nodes - Nunjucks nodes
   * @param {any} lexer - Nunjucks lexer
   */
  public parse(parser, nodes, lexer) {
    // get the tag token
    const tok = parser.nextToken();

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    return new nodes.CallExtension(this, tok.value, args, []);
  }

  /**
   * Render template with parameters.
   *
   * @param {Context} context - Nunjucks Context
   * @param {string} templateFile - Template file
   * @param {object} data - Data for template
   * @param {RenderOptions} options - Options
   * @return {SafeString}
   */
  public render(
    context: Context,
    templateFile: string,
    data: object = {},
    options: RenderOptions = { includeContext: false },
  ): SafeString {
    const fullPathToTemplate: string = this.getFullPathToTemplate(templateFile);
    const hydratedData = options.includeContext
      ? Object.assign({}, { context: context.ctx }, data)
      : data;
    const renderedOutput = this.options.environment.render(
      fullPathToTemplate,
      hydratedData,
    );

    return new SafeString(renderedOutput);
  }

  /**
   * Get full path to template file.
   *
   * @param {string} templateFilePath - Template file path
   * @return {string}
   * @private
   */
  private getFullPathToTemplate(templateFilePath: string): string {
    return path.join(this.options.templatePath, templateFilePath);
  }
}

/**
 * Options for RenderExtension.
 */
export interface RenderExtensionOptions {
  environment: Environment;
  templatePath: string;
}

/**
 * Options for render tag.
 */
export interface RenderOptions {
  includeContext: boolean;
}
