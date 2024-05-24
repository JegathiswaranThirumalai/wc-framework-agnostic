import {
  __async,
  __spreadProps,
  __spreadValues,
  __superGet
} from "./chunk-LJ4VCL4A.js";

// ../web-component-sdk/node_modules/@lit/reactive-element/development/css-tag.js
var NODE_MODE = false;
var global2 = globalThis;
var supportsAdoptingStyleSheets = global2.ShadowRoot && (global2.ShadyCSS === void 0 || global2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var constructionToken = Symbol();
var cssTagCache = /* @__PURE__ */ new WeakMap();
var CSSResult = class {
  constructor(cssText, strings, safeToken) {
    this["_$cssResult$"] = true;
    if (safeToken !== constructionToken) {
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    }
    this.cssText = cssText;
    this._strings = strings;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let styleSheet = this._styleSheet;
    const strings = this._strings;
    if (supportsAdoptingStyleSheets && styleSheet === void 0) {
      const cacheable = strings !== void 0 && strings.length === 1;
      if (cacheable) {
        styleSheet = cssTagCache.get(strings);
      }
      if (styleSheet === void 0) {
        (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
        if (cacheable) {
          cssTagCache.set(strings, styleSheet);
        }
      }
    }
    return styleSheet;
  }
  toString() {
    return this.cssText;
  }
};
var textFromCSSResult = (value) => {
  if (value["_$cssResult$"] === true) {
    return value.cssText;
  } else if (typeof value === "number") {
    return value;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
  }
};
var unsafeCSS = (value) => new CSSResult(typeof value === "string" ? value : String(value), void 0, constructionToken);
var css = (strings, ...values) => {
  const cssText = strings.length === 1 ? strings[0] : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText, strings, constructionToken);
};
var adoptStyles = (renderRoot, styles) => {
  if (supportsAdoptingStyleSheets) {
    renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  } else {
    for (const s of styles) {
      const style = document.createElement("style");
      const nonce = global2["litNonce"];
      if (nonce !== void 0) {
        style.setAttribute("nonce", nonce);
      }
      style.textContent = s.cssText;
      renderRoot.appendChild(style);
    }
  }
};
var cssResultFromStyleSheet = (sheet) => {
  let cssText = "";
  for (const rule of sheet.cssRules) {
    cssText += rule.cssText;
  }
  return unsafeCSS(cssText);
};
var getCompatibleStyle = supportsAdoptingStyleSheets || NODE_MODE && global2.CSSStyleSheet === void 0 ? (s) => s : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;

// ../web-component-sdk/node_modules/@lit/reactive-element/development/reactive-element.js
var { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf } = Object;
var NODE_MODE2 = false;
var global3 = globalThis;
if (NODE_MODE2) {
  global3.customElements ??= customElements;
}
var DEV_MODE = true;
var issueWarning;
var trustedTypes = global3.trustedTypes;
var emptyStringForBooleanAttribute = trustedTypes ? trustedTypes.emptyScript : "";
var polyfillSupport = DEV_MODE ? global3.reactiveElementPolyfillSupportDevMode : global3.reactiveElementPolyfillSupport;
if (DEV_MODE) {
  const issuedWarnings = global3.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
  issueWarning("dev-mode", `Lit is in dev mode. Not recommended for production!`);
  if (global3.ShadyDOM?.inUse && polyfillSupport === void 0) {
    issueWarning("polyfill-support-missing", `Shadow DOM is being polyfilled via \`ShadyDOM\` but the \`polyfill-support\` module has not been loaded.`);
  }
}
var debugLogEvent = DEV_MODE ? (event) => {
  const shouldEmit = global3.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global3.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var JSCompiler_renameProperty = (prop, _obj) => prop;
var defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        value = value ? emptyStringForBooleanAttribute : null;
        break;
      case Object:
      case Array:
        value = value == null ? value : JSON.stringify(value);
        break;
    }
    return value;
  },
  fromAttribute(value, type) {
    let fromValue = value;
    switch (type) {
      case Boolean:
        fromValue = value !== null;
        break;
      case Number:
        fromValue = value === null ? null : Number(value);
        break;
      case Object:
      case Array:
        try {
          fromValue = JSON.parse(value);
        } catch (e) {
          fromValue = null;
        }
        break;
    }
    return fromValue;
  }
};
var notEqual = (value, old) => !is(value, old);
var defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
Symbol.metadata ??= Symbol("metadata");
global3.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ReactiveElement = class extends HTMLElement {
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(initializer) {
    this.__prepare();
    (this._initializers ??= []).push(initializer);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    this.finalize();
    return this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    if (options.state) {
      options.attribute = false;
    }
    this.__prepare();
    this.elementProperties.set(name, options);
    if (!options.noAccessor) {
      const key = DEV_MODE ? (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        Symbol.for(`${String(name)} (@property() cache)`)
      ) : Symbol();
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== void 0) {
        defineProperty(this.prototype, name, descriptor);
      }
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(name, key, options) {
    const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
      get() {
        return this[key];
      },
      set(v) {
        this[key] = v;
      }
    };
    if (DEV_MODE && get == null) {
      if ("value" in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
        throw new Error(`Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      }
      issueWarning("reactive-property-without-getter", `Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get() {
        return get?.call(this);
      },
      set(value) {
        const oldValue = get?.call(this);
        set.call(this, value);
        this.requestUpdate(name, oldValue, options);
      },
      configurable: true,
      enumerable: true
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(name) {
    return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
  }
  /**
   * Initializes static own properties of the class used in bookkeeping
   * for element properties, initializers, etc.
   *
   * Can be called multiple times by code that needs to ensure these
   * properties exist before using them.
   *
   * This method ensures the superclass is finalized so that inherited
   * property metadata can be copied down.
   * @nocollapse
   */
  static __prepare() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("elementProperties", this))) {
      return;
    }
    const superCtor = getPrototypeOf(this);
    superCtor.finalize();
    if (superCtor._initializers !== void 0) {
      this._initializers = [...superCtor._initializers];
    }
    this.elementProperties = new Map(superCtor.elementProperties);
  }
  /**
   * Finishes setting up the class so that it's ready to be registered
   * as a custom element and instantiated.
   *
   * This method is called by the ReactiveElement.observedAttributes getter.
   * If you override the observedAttributes getter, you must either call
   * super.observedAttributes to trigger finalization, or call finalize()
   * yourself.
   *
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("finalized", this))) {
      return;
    }
    this.finalized = true;
    this.__prepare();
    if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const props = this.properties;
      const propKeys = [
        ...getOwnPropertyNames(props),
        ...getOwnPropertySymbols(props)
      ];
      for (const p of propKeys) {
        this.createProperty(p, props[p]);
      }
    }
    const metadata = this[Symbol.metadata];
    if (metadata !== null) {
      const properties = litPropertyMetadata.get(metadata);
      if (properties !== void 0) {
        for (const [p, options] of properties) {
          this.elementProperties.set(p, options);
        }
      }
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [p, options] of this.elementProperties) {
      const attr2 = this.__attributeNameForProperty(p, options);
      if (attr2 !== void 0) {
        this.__attributeToPropertyMap.set(attr2, p);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);
    if (DEV_MODE) {
      if (this.hasOwnProperty("createProperty")) {
        issueWarning("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");
      }
      if (this.hasOwnProperty("getPropertyDescriptor")) {
        issueWarning("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
      }
    }
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(styles) {
    const elementStyles = [];
    if (Array.isArray(styles)) {
      const set = new Set(styles.flat(Infinity).reverse());
      for (const s of set) {
        elementStyles.unshift(getCompatibleStyle(s));
      }
    } else if (styles !== void 0) {
      elementStyles.push(getCompatibleStyle(styles));
    }
    return elementStyles;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
  }
  constructor() {
    super();
    this.__instanceProperties = void 0;
    this.isUpdatePending = false;
    this.hasUpdated = false;
    this.__reflectingProperty = null;
    this.__initialize();
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    this.__updatePromise = new Promise((res) => this.enableUpdating = res);
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.__saveInstanceProperties();
    this.requestUpdate();
    this.constructor._initializers?.forEach((i) => i(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(controller) {
    (this.__controllers ??= /* @__PURE__ */ new Set()).add(controller);
    if (this.renderRoot !== void 0 && this.isConnected) {
      controller.hostConnected?.();
    }
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(controller) {
    this.__controllers?.delete(controller);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */
  __saveInstanceProperties() {
    const instanceProperties = /* @__PURE__ */ new Map();
    const elementProperties = this.constructor.elementProperties;
    for (const p of elementProperties.keys()) {
      if (this.hasOwnProperty(p)) {
        instanceProperties.set(p, this[p]);
        delete this[p];
      }
    }
    if (instanceProperties.size > 0) {
      this.__instanceProperties = instanceProperties;
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    adoptStyles(renderRoot, this.constructor.elementStyles);
    return renderRoot;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot();
    this.enableUpdating(true);
    this.__controllers?.forEach((c) => c.hostConnected?.());
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(_requestedUpdate) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    this.__controllers?.forEach((c) => c.hostDisconnected?.());
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(name, _old, value) {
    this._$attributeToProperty(name, value);
  }
  __propertyToAttribute(name, value) {
    const elemProperties = this.constructor.elementProperties;
    const options = elemProperties.get(name);
    const attr2 = this.constructor.__attributeNameForProperty(name, options);
    if (attr2 !== void 0 && options.reflect === true) {
      const converter = options.converter?.toAttribute !== void 0 ? options.converter : defaultConverter;
      const attrValue = converter.toAttribute(value, options.type);
      if (DEV_MODE && this.constructor.enabledWarnings.includes("migration") && attrValue === void 0) {
        issueWarning("undefined-attribute-value", `The attribute value for the ${name} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);
      }
      this.__reflectingProperty = name;
      if (attrValue == null) {
        this.removeAttribute(attr2);
      } else {
        this.setAttribute(attr2, attrValue);
      }
      this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(name, value) {
    const ctor = this.constructor;
    const propName = ctor.__attributeToPropertyMap.get(name);
    if (propName !== void 0 && this.__reflectingProperty !== propName) {
      const options = ctor.getPropertyOptions(propName);
      const converter = typeof options.converter === "function" ? { fromAttribute: options.converter } : options.converter?.fromAttribute !== void 0 ? options.converter : defaultConverter;
      this.__reflectingProperty = propName;
      this[propName] = converter.fromAttribute(
        value,
        options.type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      );
      this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @category updates
   */
  requestUpdate(name, oldValue, options) {
    if (name !== void 0) {
      if (DEV_MODE && name instanceof Event) {
        issueWarning(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
      }
      options ??= this.constructor.getPropertyOptions(name);
      const hasChanged = options.hasChanged ?? notEqual;
      const newValue = this[name];
      if (hasChanged(newValue, oldValue)) {
        this._$changeProperty(name, oldValue, options);
      } else {
        return;
      }
    }
    if (this.isUpdatePending === false) {
      this.__updatePromise = this.__enqueueUpdate();
    }
  }
  /**
   * @internal
   */
  _$changeProperty(name, oldValue, options) {
    if (!this._$changedProperties.has(name)) {
      this._$changedProperties.set(name, oldValue);
    }
    if (options.reflect === true && this.__reflectingProperty !== name) {
      (this.__reflectingProperties ??= /* @__PURE__ */ new Set()).add(name);
    }
  }
  /**
   * Sets up the element to asynchronously update.
   */
  __enqueueUpdate() {
    return __async(this, null, function* () {
      this.isUpdatePending = true;
      try {
        yield this.__updatePromise;
      } catch (e) {
        Promise.reject(e);
      }
      const result = this.scheduleUpdate();
      if (result != null) {
        yield result;
      }
      return !this.isUpdatePending;
    });
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    const result = this.performUpdate();
    if (DEV_MODE && this.constructor.enabledWarnings.includes("async-perform-update") && typeof result?.then === "function") {
      issueWarning("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);
    }
    return result;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * @category updates
   */
  performUpdate() {
    if (!this.isUpdatePending) {
      return;
    }
    debugLogEvent?.({ kind: "update" });
    if (!this.hasUpdated) {
      this.renderRoot ??= this.createRenderRoot();
      if (DEV_MODE) {
        const ctor = this.constructor;
        const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
        if (shadowedProperties.length) {
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${shadowedProperties.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
        }
      }
      if (this.__instanceProperties) {
        for (const [p, value] of this.__instanceProperties) {
          this[p] = value;
        }
        this.__instanceProperties = void 0;
      }
      const elementProperties = this.constructor.elementProperties;
      if (elementProperties.size > 0) {
        for (const [p, options] of elementProperties) {
          if (options.wrapped === true && !this._$changedProperties.has(p) && this[p] !== void 0) {
            this._$changeProperty(p, this[p], options);
          }
        }
      }
    }
    let shouldUpdate = false;
    const changedProperties = this._$changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.willUpdate(changedProperties);
        this.__controllers?.forEach((c) => c.hostUpdate?.());
        this.update(changedProperties);
      } else {
        this.__markUpdated();
      }
    } catch (e) {
      shouldUpdate = false;
      this.__markUpdated();
      throw e;
    }
    if (shouldUpdate) {
      this._$didUpdate(changedProperties);
    }
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(_changedProperties) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(changedProperties) {
    this.__controllers?.forEach((c) => c.hostUpdated?.());
    if (!this.hasUpdated) {
      this.hasUpdated = true;
      this.firstUpdated(changedProperties);
    }
    this.updated(changedProperties);
    if (DEV_MODE && this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update")) {
      issueWarning("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
    }
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.isUpdatePending = false;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(_changedProperties) {
    this.__reflectingProperties &&= this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p]));
    this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(_changedProperties) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(_changedProperties) {
  }
};
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: "open" };
ReactiveElement[JSCompiler_renameProperty("elementProperties", ReactiveElement)] = /* @__PURE__ */ new Map();
ReactiveElement[JSCompiler_renameProperty("finalized", ReactiveElement)] = /* @__PURE__ */ new Map();
polyfillSupport?.({ ReactiveElement });
if (DEV_MODE) {
  ReactiveElement.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const ensureOwnWarnings = function(ctor) {
    if (!ctor.hasOwnProperty(JSCompiler_renameProperty("enabledWarnings", ctor))) {
      ctor.enabledWarnings = ctor.enabledWarnings.slice();
    }
  };
  ReactiveElement.enableWarning = function(warning) {
    ensureOwnWarnings(this);
    if (!this.enabledWarnings.includes(warning)) {
      this.enabledWarnings.push(warning);
    }
  };
  ReactiveElement.disableWarning = function(warning) {
    ensureOwnWarnings(this);
    const i = this.enabledWarnings.indexOf(warning);
    if (i >= 0) {
      this.enabledWarnings.splice(i, 1);
    }
  };
}
(global3.reactiveElementVersions ??= []).push("2.0.4");
if (DEV_MODE && global3.reactiveElementVersions.length > 1) {
  issueWarning("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}

// ../web-component-sdk/node_modules/lit-html/development/lit-html.js
var DEV_MODE2 = true;
var ENABLE_EXTRA_SECURITY_HOOKS = true;
var ENABLE_SHADYDOM_NOPATCH = true;
var NODE_MODE3 = false;
var global4 = globalThis;
var debugLogEvent2 = DEV_MODE2 ? (event) => {
  const shouldEmit = global4.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global4.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var debugLogRenderId = 0;
var issueWarning2;
if (DEV_MODE2) {
  global4.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning2 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!global4.litIssuedWarnings.has(warning)) {
      console.warn(warning);
      global4.litIssuedWarnings.add(warning);
    }
  };
  issueWarning2("dev-mode", `Lit is in dev mode. Not recommended for production!`);
}
var wrap = ENABLE_SHADYDOM_NOPATCH && global4.ShadyDOM?.inUse && global4.ShadyDOM?.noPatch === true ? global4.ShadyDOM.wrap : (node) => node;
var trustedTypes2 = global4.trustedTypes;
var policy = trustedTypes2 ? trustedTypes2.createPolicy("lit-html", {
  createHTML: (s) => s
}) : void 0;
var identityFunction = (value) => value;
var noopSanitizer = (_node, _name, _type) => identityFunction;
var setSanitizer = (newSanitizer) => {
  if (!ENABLE_EXTRA_SECURITY_HOOKS) {
    return;
  }
  if (sanitizerFactoryInternal !== noopSanitizer) {
    throw new Error(`Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.`);
  }
  sanitizerFactoryInternal = newSanitizer;
};
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
  sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = (node, name, type) => {
  return sanitizerFactoryInternal(node, name, type);
};
var boundAttributeSuffix = "$lit$";
var marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
var markerMatch = "?" + marker;
var nodeMarker = `<${markerMatch}>`;
var d = NODE_MODE3 && global4.document === void 0 ? {
  createTreeWalker() {
    return {};
  }
} : document;
var createMarker = () => d.createComment("");
var isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
var isArray = Array.isArray;
var isIterable = (value) => isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof value?.[Symbol.iterator] === "function";
var SPACE_CHAR = `[ 	
\f\r]`;
var ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
var NAME_CHAR = `[^\\s"'>=/]`;
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var COMMENT_START = 1;
var TAG_NAME = 2;
var DYNAMIC_TAG_NAME = 3;
var commentEndRegex = /-->/g;
var comment2EndRegex = />/g;
var tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
var ENTIRE_MATCH = 0;
var ATTRIBUTE_NAME = 1;
var SPACES_AND_EQUALS = 2;
var QUOTE_CHAR = 3;
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
var rawTextElement = /^(?:script|style|textarea|title)$/i;
var HTML_RESULT = 1;
var SVG_RESULT = 2;
var ATTRIBUTE_PART = 1;
var CHILD_PART = 2;
var PROPERTY_PART = 3;
var BOOLEAN_ATTRIBUTE_PART = 4;
var EVENT_PART = 5;
var ELEMENT_PART = 6;
var COMMENT_PART = 7;
var tag = (type) => (strings, ...values) => {
  if (DEV_MODE2 && strings.some((s) => s === void 0)) {
    console.warn("Some template strings are undefined.\nThis is probably caused by illegal octal escape sequences.");
  }
  if (DEV_MODE2) {
    if (values.some((val) => val?.["_$litStatic$"])) {
      issueWarning2("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);
    }
  }
  return {
    // This property needs to remain unminified.
    ["_$litType$"]: type,
    strings,
    values
  };
};
var html = tag(HTML_RESULT);
var svg = tag(SVG_RESULT);
var noChange = Symbol.for("lit-noChange");
var nothing = Symbol.for("lit-nothing");
var templateCache = /* @__PURE__ */ new WeakMap();
var walker = d.createTreeWalker(
  d,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
  if (!Array.isArray(tsa) || !tsa.hasOwnProperty("raw")) {
    let message = "invalid template strings array";
    if (DEV_MODE2) {
      message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, "\n");
    }
    throw new Error(message);
  }
  return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
var getTemplateHtml = (strings, type) => {
  const l = strings.length - 1;
  const attrNames = [];
  let html3 = type === SVG_RESULT ? "<svg>" : "";
  let rawTextEndRegex;
  let regex = textEndRegex;
  for (let i = 0; i < l; i++) {
    const s = strings[i];
    let attrNameEndIndex = -1;
    let attrName;
    let lastIndex = 0;
    let match;
    while (lastIndex < s.length) {
      regex.lastIndex = lastIndex;
      match = regex.exec(s);
      if (match === null) {
        break;
      }
      lastIndex = regex.lastIndex;
      if (regex === textEndRegex) {
        if (match[COMMENT_START] === "!--") {
          regex = commentEndRegex;
        } else if (match[COMMENT_START] !== void 0) {
          regex = comment2EndRegex;
        } else if (match[TAG_NAME] !== void 0) {
          if (rawTextElement.test(match[TAG_NAME])) {
            rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
          }
          regex = tagEndRegex;
        } else if (match[DYNAMIC_TAG_NAME] !== void 0) {
          if (DEV_MODE2) {
            throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
          }
          regex = tagEndRegex;
        }
      } else if (regex === tagEndRegex) {
        if (match[ENTIRE_MATCH] === ">") {
          regex = rawTextEndRegex ?? textEndRegex;
          attrNameEndIndex = -1;
        } else if (match[ATTRIBUTE_NAME] === void 0) {
          attrNameEndIndex = -2;
        } else {
          attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
          attrName = match[ATTRIBUTE_NAME];
          regex = match[QUOTE_CHAR] === void 0 ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
        }
      } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
        regex = tagEndRegex;
      } else if (regex === commentEndRegex || regex === comment2EndRegex) {
        regex = textEndRegex;
      } else {
        regex = tagEndRegex;
        rawTextEndRegex = void 0;
      }
    }
    if (DEV_MODE2) {
      console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, "unexpected parse state B");
    }
    const end = regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
    html3 += regex === textEndRegex ? s + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s.slice(0, attrNameEndIndex) + boundAttributeSuffix + s.slice(attrNameEndIndex)) + marker + end : s + marker + (attrNameEndIndex === -2 ? i : end);
  }
  const htmlResult = html3 + (strings[l] || "<?>") + (type === SVG_RESULT ? "</svg>" : "");
  return [trustFromTemplateString(strings, htmlResult), attrNames];
};
var Template = class _Template {
  constructor({ strings, ["_$litType$"]: type }, options) {
    this.parts = [];
    let node;
    let nodeIndex = 0;
    let attrNameIndex = 0;
    const partCount = strings.length - 1;
    const parts = this.parts;
    const [html3, attrNames] = getTemplateHtml(strings, type);
    this.el = _Template.createElement(html3, options);
    walker.currentNode = this.el.content;
    if (type === SVG_RESULT) {
      const svgElement = this.el.content.firstChild;
      svgElement.replaceWith(...svgElement.childNodes);
    }
    while ((node = walker.nextNode()) !== null && parts.length < partCount) {
      if (node.nodeType === 1) {
        if (DEV_MODE2) {
          const tag2 = node.localName;
          if (/^(?:textarea|template)$/i.test(tag2) && node.innerHTML.includes(marker)) {
            const m = `Expressions are not supported inside \`${tag2}\` elements. See https://lit.dev/msg/expression-in-${tag2} for more information.`;
            if (tag2 === "template") {
              throw new Error(m);
            } else
              issueWarning2("", m);
          }
        }
        if (node.hasAttributes()) {
          for (const name of node.getAttributeNames()) {
            if (name.endsWith(boundAttributeSuffix)) {
              const realName = attrNames[attrNameIndex++];
              const value = node.getAttribute(name);
              const statics = value.split(marker);
              const m = /([.?@])?(.*)/.exec(realName);
              parts.push({
                type: ATTRIBUTE_PART,
                index: nodeIndex,
                name: m[2],
                strings: statics,
                ctor: m[1] === "." ? PropertyPart : m[1] === "?" ? BooleanAttributePart : m[1] === "@" ? EventPart : AttributePart
              });
              node.removeAttribute(name);
            } else if (name.startsWith(marker)) {
              parts.push({
                type: ELEMENT_PART,
                index: nodeIndex
              });
              node.removeAttribute(name);
            }
          }
        }
        if (rawTextElement.test(node.tagName)) {
          const strings2 = node.textContent.split(marker);
          const lastIndex = strings2.length - 1;
          if (lastIndex > 0) {
            node.textContent = trustedTypes2 ? trustedTypes2.emptyScript : "";
            for (let i = 0; i < lastIndex; i++) {
              node.append(strings2[i], createMarker());
              walker.nextNode();
              parts.push({ type: CHILD_PART, index: ++nodeIndex });
            }
            node.append(strings2[lastIndex], createMarker());
          }
        }
      } else if (node.nodeType === 8) {
        const data = node.data;
        if (data === markerMatch) {
          parts.push({ type: CHILD_PART, index: nodeIndex });
        } else {
          let i = -1;
          while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
            parts.push({ type: COMMENT_PART, index: nodeIndex });
            i += marker.length - 1;
          }
        }
      }
      nodeIndex++;
    }
    if (DEV_MODE2) {
      if (attrNames.length !== attrNameIndex) {
        throw new Error(`Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=\${true} ?disabled=\${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: 
\`` + strings.join("${...}") + "`");
      }
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(html3, _options) {
    const el = d.createElement("template");
    el.innerHTML = html3;
    return el;
  }
};
function resolveDirective(part, value, parent = part, attributeIndex) {
  if (value === noChange) {
    return value;
  }
  let currentDirective = attributeIndex !== void 0 ? parent.__directives?.[attributeIndex] : parent.__directive;
  const nextDirectiveConstructor = isPrimitive(value) ? void 0 : (
    // This property needs to remain unminified.
    value["_$litDirective$"]
  );
  if (currentDirective?.constructor !== nextDirectiveConstructor) {
    currentDirective?.["_$notifyDirectiveConnectionChanged"]?.(false);
    if (nextDirectiveConstructor === void 0) {
      currentDirective = void 0;
    } else {
      currentDirective = new nextDirectiveConstructor(part);
      currentDirective._$initialize(part, parent, attributeIndex);
    }
    if (attributeIndex !== void 0) {
      (parent.__directives ??= [])[attributeIndex] = currentDirective;
    } else {
      parent.__directive = currentDirective;
    }
  }
  if (currentDirective !== void 0) {
    value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
  }
  return value;
}
var TemplateInstance = class {
  constructor(template, parent) {
    this._$parts = [];
    this._$disconnectableChildren = void 0;
    this._$template = template;
    this._$parent = parent;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(options) {
    const { el: { content }, parts } = this._$template;
    const fragment = (options?.creationScope ?? d).importNode(content, true);
    walker.currentNode = fragment;
    let node = walker.nextNode();
    let nodeIndex = 0;
    let partIndex = 0;
    let templatePart = parts[0];
    while (templatePart !== void 0) {
      if (nodeIndex === templatePart.index) {
        let part;
        if (templatePart.type === CHILD_PART) {
          part = new ChildPart(node, node.nextSibling, this, options);
        } else if (templatePart.type === ATTRIBUTE_PART) {
          part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
        } else if (templatePart.type === ELEMENT_PART) {
          part = new ElementPart(node, this, options);
        }
        this._$parts.push(part);
        templatePart = parts[++partIndex];
      }
      if (nodeIndex !== templatePart?.index) {
        node = walker.nextNode();
        nodeIndex++;
      }
    }
    walker.currentNode = d;
    return fragment;
  }
  _update(values) {
    let i = 0;
    for (const part of this._$parts) {
      if (part !== void 0) {
        debugLogEvent2 && debugLogEvent2({
          kind: "set part",
          part,
          value: values[i],
          valueIndex: i,
          values,
          templateInstance: this
        });
        if (part.strings !== void 0) {
          part._$setValue(values, part, i);
          i += part.strings.length - 2;
        } else {
          part._$setValue(values[i]);
        }
      }
      i++;
    }
  }
};
var ChildPart = class _ChildPart {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent?._$isConnected ?? this.__isConnected;
  }
  constructor(startNode, endNode, parent, options) {
    this.type = CHILD_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this._$startNode = startNode;
    this._$endNode = endNode;
    this._$parent = parent;
    this.options = options;
    this.__isConnected = options?.isConnected ?? true;
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._textSanitizer = void 0;
    }
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let parentNode = wrap(this._$startNode).parentNode;
    const parent = this._$parent;
    if (parent !== void 0 && parentNode?.nodeType === 11) {
      parentNode = parent.parentNode;
    }
    return parentNode;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(value, directiveParent = this) {
    if (DEV_MODE2 && this.parentNode === null) {
      throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
    }
    value = resolveDirective(this, value, directiveParent);
    if (isPrimitive(value)) {
      if (value === nothing || value == null || value === "") {
        if (this._$committedValue !== nothing) {
          debugLogEvent2 && debugLogEvent2({
            kind: "commit nothing to child",
            start: this._$startNode,
            end: this._$endNode,
            parent: this._$parent,
            options: this.options
          });
          this._$clear();
        }
        this._$committedValue = nothing;
      } else if (value !== this._$committedValue && value !== noChange) {
        this._commitText(value);
      }
    } else if (value["_$litType$"] !== void 0) {
      this._commitTemplateResult(value);
    } else if (value.nodeType !== void 0) {
      if (DEV_MODE2 && this.options?.host === value) {
        this._commitText(`[probable mistake: rendered a template's host in itself (commonly caused by writing \${this} in a template]`);
        console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
        return;
      }
      this._commitNode(value);
    } else if (isIterable(value)) {
      this._commitIterable(value);
    } else {
      this._commitText(value);
    }
  }
  _insert(node) {
    return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
  }
  _commitNode(value) {
    if (this._$committedValue !== value) {
      this._$clear();
      if (ENABLE_EXTRA_SECURITY_HOOKS && sanitizerFactoryInternal !== noopSanitizer) {
        const parentNodeName = this._$startNode.parentNode?.nodeName;
        if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
          let message = "Forbidden";
          if (DEV_MODE2) {
            if (parentNodeName === "STYLE") {
              message = `Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css\`...\` literals to compose styles, and make do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.`;
            } else {
              message = `Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.`;
            }
          }
          throw new Error(message);
        }
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value,
        options: this.options
      });
      this._$committedValue = this._insert(value);
    }
  }
  _commitText(value) {
    if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
      const node = wrap(this._$startNode).nextSibling;
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(node, "data", "property");
        }
        value = this._textSanitizer(value);
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit text",
        node,
        value,
        options: this.options
      });
      node.data = value;
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        const textNode = d.createTextNode("");
        this._commitNode(textNode);
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(textNode, "data", "property");
        }
        value = this._textSanitizer(value);
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: textNode,
          value,
          options: this.options
        });
        textNode.data = value;
      } else {
        this._commitNode(d.createTextNode(value));
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: wrap(this._$startNode).nextSibling,
          value,
          options: this.options
        });
      }
    }
    this._$committedValue = value;
  }
  _commitTemplateResult(result) {
    const { values, ["_$litType$"]: type } = result;
    const template = typeof type === "number" ? this._$getTemplate(result) : (type.el === void 0 && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
    if (this._$committedValue?._$template === template) {
      debugLogEvent2 && debugLogEvent2({
        kind: "template updating",
        template,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values
      });
      this._$committedValue._update(values);
    } else {
      const instance = new TemplateInstance(template, this);
      const fragment = instance._clone(this.options);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      instance._update(values);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated and updated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      this._commitNode(fragment);
      this._$committedValue = instance;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(result) {
    let template = templateCache.get(result.strings);
    if (template === void 0) {
      templateCache.set(result.strings, template = new Template(result));
    }
    return template;
  }
  _commitIterable(value) {
    if (!isArray(this._$committedValue)) {
      this._$committedValue = [];
      this._$clear();
    }
    const itemParts = this._$committedValue;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      if (partIndex === itemParts.length) {
        itemParts.push(itemPart = new _ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
      } else {
        itemPart = itemParts[partIndex];
      }
      itemPart._$setValue(item);
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
      itemParts.length = partIndex;
    }
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives in
   *     those Parts.
   *
   * @internal
   */
  _$clear(start = wrap(this._$startNode).nextSibling, from2) {
    this._$notifyConnectionChanged?.(false, true, from2);
    while (start && start !== this._$endNode) {
      const n = wrap(start).nextSibling;
      wrap(start).remove();
      start = n;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this metod
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(isConnected) {
    if (this._$parent === void 0) {
      this.__isConnected = isConnected;
      this._$notifyConnectionChanged?.(isConnected);
    } else if (DEV_MODE2) {
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
    }
  }
};
var AttributePart = class {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(element, name, strings, parent, options) {
    this.type = ATTRIBUTE_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this.element = element;
    this.name = name;
    this._$parent = parent;
    this.options = options;
    if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
      this._$committedValue = new Array(strings.length - 1).fill(new String());
      this.strings = strings;
    } else {
      this._$committedValue = nothing;
    }
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._sanitizer = void 0;
    }
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(value, directiveParent = this, valueIndex, noCommit) {
    const strings = this.strings;
    let change = false;
    if (strings === void 0) {
      value = resolveDirective(this, value, directiveParent, 0);
      change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
      if (change) {
        this._$committedValue = value;
      }
    } else {
      const values = value;
      value = strings[0];
      let i, v;
      for (i = 0; i < strings.length - 1; i++) {
        v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
        if (v === noChange) {
          v = this._$committedValue[i];
        }
        change ||= !isPrimitive(v) || v !== this._$committedValue[i];
        if (v === nothing) {
          value = nothing;
        } else if (value !== nothing) {
          value += (v ?? "") + strings[i + 1];
        }
        this._$committedValue[i] = v;
      }
    }
    if (change && !noCommit) {
      this._commitValue(value);
    }
  }
  /** @internal */
  _commitValue(value) {
    if (value === nothing) {
      wrap(this.element).removeAttribute(this.name);
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._sanitizer === void 0) {
          this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "attribute");
        }
        value = this._sanitizer(value ?? "");
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit attribute",
        element: this.element,
        name: this.name,
        value,
        options: this.options
      });
      wrap(this.element).setAttribute(this.name, value ?? "");
    }
  }
};
var PropertyPart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = PROPERTY_PART;
  }
  /** @internal */
  _commitValue(value) {
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      if (this._sanitizer === void 0) {
        this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "property");
      }
      value = this._sanitizer(value);
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value,
      options: this.options
    });
    this.element[this.name] = value === nothing ? void 0 : value;
  }
};
var BooleanAttributePart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = BOOLEAN_ATTRIBUTE_PART;
  }
  /** @internal */
  _commitValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(value && value !== nothing),
      options: this.options
    });
    wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
  }
};
var EventPart = class extends AttributePart {
  constructor(element, name, strings, parent, options) {
    super(element, name, strings, parent, options);
    this.type = EVENT_PART;
    if (DEV_MODE2 && this.strings !== void 0) {
      throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
    }
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(newListener, directiveParent = this) {
    newListener = resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
    if (newListener === noChange) {
      return;
    }
    const oldListener = this._$committedValue;
    const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
    const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
    debugLogEvent2 && debugLogEvent2({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: newListener,
      options: this.options,
      removeListener: shouldRemoveListener,
      addListener: shouldAddListener,
      oldListener
    });
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.name, this, oldListener);
    }
    if (shouldAddListener) {
      this.element.addEventListener(this.name, this, newListener);
    }
    this._$committedValue = newListener;
  }
  handleEvent(event) {
    if (typeof this._$committedValue === "function") {
      this._$committedValue.call(this.options?.host ?? this.element, event);
    } else {
      this._$committedValue.handleEvent(event);
    }
  }
};
var ElementPart = class {
  constructor(element, parent, options) {
    this.element = element;
    this.type = ELEMENT_PART;
    this._$disconnectableChildren = void 0;
    this._$parent = parent;
    this.options = options;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit to element binding",
      element: this.element,
      value,
      options: this.options
    });
    resolveDirective(this, value);
  }
};
var polyfillSupport2 = DEV_MODE2 ? global4.litHtmlPolyfillSupportDevMode : global4.litHtmlPolyfillSupport;
polyfillSupport2?.(Template, ChildPart);
(global4.litHtmlVersions ??= []).push("3.1.3");
if (DEV_MODE2 && global4.litHtmlVersions.length > 1) {
  issueWarning2("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}
var render = (value, container, options) => {
  if (DEV_MODE2 && container == null) {
    throw new TypeError(`The container to render into may not be ${container}`);
  }
  const renderId = DEV_MODE2 ? debugLogRenderId++ : 0;
  const partOwnerNode = options?.renderBefore ?? container;
  let part = partOwnerNode["_$litPart$"];
  debugLogEvent2 && debugLogEvent2({
    kind: "begin render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  if (part === void 0) {
    const endNode = options?.renderBefore ?? null;
    partOwnerNode["_$litPart$"] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, void 0, options ?? {});
  }
  part._$setValue(value);
  debugLogEvent2 && debugLogEvent2({
    kind: "end render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
  render.setSanitizer = setSanitizer;
  render.createSanitizer = createSanitizer;
  if (DEV_MODE2) {
    render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
  }
}

// ../web-component-sdk/node_modules/lit-element/development/lit-element.js
var JSCompiler_renameProperty2 = (prop, _obj) => prop;
var DEV_MODE3 = true;
var issueWarning3;
if (DEV_MODE3) {
  const issuedWarnings = globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning3 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
var LitElement = class extends ReactiveElement {
  constructor() {
    super(...arguments);
    this.renderOptions = { host: this };
    this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = super.createRenderRoot();
    this.renderOptions.renderBefore ??= renderRoot.firstChild;
    return renderRoot;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(changedProperties) {
    const value = this.render();
    if (!this.hasUpdated) {
      this.renderOptions.isConnected = this.isConnected;
    }
    super.update(changedProperties);
    this.__childPart = render(value, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.__childPart?.setConnected(true);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__childPart?.setConnected(false);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return noChange;
  }
};
LitElement["_$litElement$"] = true;
LitElement[JSCompiler_renameProperty2("finalized", LitElement)] = true;
globalThis.litElementHydrateSupport?.({ LitElement });
var polyfillSupport3 = DEV_MODE3 ? globalThis.litElementPolyfillSupportDevMode : globalThis.litElementPolyfillSupport;
polyfillSupport3?.({ LitElement });
(globalThis.litElementVersions ??= []).push("4.0.5");
if (DEV_MODE3 && globalThis.litElementVersions.length > 1) {
  issueWarning3("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}

// ../web-component-sdk/node_modules/@lit/reactive-element/development/decorators/custom-element.js
var customElement = (tagName) => (classOrTarget, context) => {
  if (context !== void 0) {
    context.addInitializer(() => {
      customElements.define(tagName, classOrTarget);
    });
  } else {
    customElements.define(tagName, classOrTarget);
  }
};

// ../web-component-sdk/node_modules/@lit/reactive-element/development/decorators/property.js
var DEV_MODE4 = true;
var issueWarning4;
if (DEV_MODE4) {
  const issuedWarnings = globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning4 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
var legacyProperty = (options, proto, name) => {
  const hasOwnProperty = proto.hasOwnProperty(name);
  proto.constructor.createProperty(name, hasOwnProperty ? __spreadProps(__spreadValues({}, options), { wrapped: true }) : options);
  return hasOwnProperty ? Object.getOwnPropertyDescriptor(proto, name) : void 0;
};
var defaultPropertyDeclaration2 = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
var standardProperty = (options = defaultPropertyDeclaration2, target2, context) => {
  const { kind, metadata } = context;
  if (DEV_MODE4 && metadata == null) {
    issueWarning4("missing-class-metadata", `The class ${target2} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  }
  let properties = globalThis.litPropertyMetadata.get(metadata);
  if (properties === void 0) {
    globalThis.litPropertyMetadata.set(metadata, properties = /* @__PURE__ */ new Map());
  }
  properties.set(context.name, options);
  if (kind === "accessor") {
    const { name } = context;
    return {
      set(v) {
        const oldValue = target2.get.call(this);
        target2.set.call(this, v);
        this.requestUpdate(name, oldValue, options);
      },
      init(v) {
        if (v !== void 0) {
          this._$changeProperty(name, void 0, options);
        }
        return v;
      }
    };
  } else if (kind === "setter") {
    const { name } = context;
    return function(value) {
      const oldValue = this[name];
      target2.call(this, value);
      this.requestUpdate(name, oldValue, options);
    };
  }
  throw new Error(`Unsupported decorator location: ${kind}`);
};
function property(options) {
  return (protoOrTarget, nameOrContext) => {
    return typeof nameOrContext === "object" ? standardProperty(options, protoOrTarget, nameOrContext) : legacyProperty(options, protoOrTarget, nameOrContext);
  };
}

// ../web-component-sdk/node_modules/@lit/reactive-element/development/decorators/query.js
var DEV_MODE5 = true;
var issueWarning5;
if (DEV_MODE5) {
  const issuedWarnings = globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning5 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/platform.js
var $global = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  try {
    return new Function("return this")();
  } catch (_a) {
    return {};
  }
}();
if ($global.trustedTypes === void 0) {
  $global.trustedTypes = { createPolicy: (n, r) => r };
}
var propConfig = {
  configurable: false,
  enumerable: false,
  writable: false
};
if ($global.FAST === void 0) {
  Reflect.defineProperty($global, "FAST", Object.assign({ value: /* @__PURE__ */ Object.create(null) }, propConfig));
}
var FAST = $global.FAST;
if (FAST.getById === void 0) {
  const storage = /* @__PURE__ */ Object.create(null);
  Reflect.defineProperty(FAST, "getById", Object.assign({ value(id, initialize) {
    let found = storage[id];
    if (found === void 0) {
      found = initialize ? storage[id] = initialize() : null;
    }
    return found;
  } }, propConfig));
}
var emptyArray = Object.freeze([]);
function createMetadataLocator() {
  const metadataLookup = /* @__PURE__ */ new WeakMap();
  return function(target2) {
    let metadata = metadataLookup.get(target2);
    if (metadata === void 0) {
      let currentTarget = Reflect.getPrototypeOf(target2);
      while (metadata === void 0 && currentTarget !== null) {
        metadata = metadataLookup.get(currentTarget);
        currentTarget = Reflect.getPrototypeOf(currentTarget);
      }
      metadata = metadata === void 0 ? [] : metadata.slice(0);
      metadataLookup.set(target2, metadata);
    }
    return metadata;
  };
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/dom.js
var updateQueue = $global.FAST.getById(1, () => {
  const tasks = [];
  const pendingErrors = [];
  function throwFirstError() {
    if (pendingErrors.length) {
      throw pendingErrors.shift();
    }
  }
  function tryRunTask(task) {
    try {
      task.call();
    } catch (error) {
      pendingErrors.push(error);
      setTimeout(throwFirstError, 0);
    }
  }
  function process() {
    const capacity = 1024;
    let index = 0;
    while (index < tasks.length) {
      tryRunTask(tasks[index]);
      index++;
      if (index > capacity) {
        for (let scan = 0, newLength = tasks.length - index; scan < newLength; scan++) {
          tasks[scan] = tasks[scan + index];
        }
        tasks.length -= index;
        index = 0;
      }
    }
    tasks.length = 0;
  }
  function enqueue(callable) {
    if (tasks.length < 1) {
      $global.requestAnimationFrame(process);
    }
    tasks.push(callable);
  }
  return Object.freeze({
    enqueue,
    process
  });
});
var fastHTMLPolicy = $global.trustedTypes.createPolicy("fast-html", {
  createHTML: (html3) => html3
});
var htmlPolicy = fastHTMLPolicy;
var marker2 = `fast-${Math.random().toString(36).substring(2, 8)}`;
var _interpolationStart = `${marker2}{`;
var _interpolationEnd = `}${marker2}`;
var DOM = Object.freeze({
  /**
   * Indicates whether the DOM supports the adoptedStyleSheets feature.
   */
  supportsAdoptedStyleSheets: Array.isArray(document.adoptedStyleSheets) && "replace" in CSSStyleSheet.prototype,
  /**
   * Sets the HTML trusted types policy used by the templating engine.
   * @param policy - The policy to set for HTML.
   * @remarks
   * This API can only be called once, for security reasons. It should be
   * called by the application developer at the start of their program.
   */
  setHTMLPolicy(policy2) {
    if (htmlPolicy !== fastHTMLPolicy) {
      throw new Error("The HTML policy can only be set once.");
    }
    htmlPolicy = policy2;
  },
  /**
   * Turns a string into trusted HTML using the configured trusted types policy.
   * @param html - The string to turn into trusted HTML.
   * @remarks
   * Used internally by the template engine when creating templates
   * and setting innerHTML.
   */
  createHTML(html3) {
    return htmlPolicy.createHTML(html3);
  },
  /**
   * Determines if the provided node is a template marker used by the runtime.
   * @param node - The node to test.
   */
  isMarker(node) {
    return node && node.nodeType === 8 && node.data.startsWith(marker2);
  },
  /**
   * Given a marker node, extract the {@link HTMLDirective} index from the placeholder.
   * @param node - The marker node to extract the index from.
   */
  extractDirectiveIndexFromMarker(node) {
    return parseInt(node.data.replace(`${marker2}:`, ""));
  },
  /**
   * Creates a placeholder string suitable for marking out a location *within*
   * an attribute value or HTML content.
   * @param index - The directive index to create the placeholder for.
   * @remarks
   * Used internally by binding directives.
   */
  createInterpolationPlaceholder(index) {
    return `${_interpolationStart}${index}${_interpolationEnd}`;
  },
  /**
   * Creates a placeholder that manifests itself as an attribute on an
   * element.
   * @param attributeName - The name of the custom attribute.
   * @param index - The directive index to create the placeholder for.
   * @remarks
   * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
   */
  createCustomAttributePlaceholder(attributeName, index) {
    return `${attributeName}="${this.createInterpolationPlaceholder(index)}"`;
  },
  /**
   * Creates a placeholder that manifests itself as a marker within the DOM structure.
   * @param index - The directive index to create the placeholder for.
   * @remarks
   * Used internally by structural directives such as `repeat`.
   */
  createBlockPlaceholder(index) {
    return `<!--${marker2}:${index}-->`;
  },
  /**
   * Schedules DOM update work in the next async batch.
   * @param callable - The callable function or object to queue.
   */
  queueUpdate: updateQueue.enqueue,
  /**
   * Immediately processes all work previously scheduled
   * through queueUpdate.
   * @remarks
   * This also forces nextUpdate promises
   * to resolve.
   */
  processUpdates: updateQueue.process,
  /**
   * Resolves with the next DOM update.
   */
  nextUpdate() {
    return new Promise(updateQueue.enqueue);
  },
  /**
   * Sets an attribute value on an element.
   * @param element - The element to set the attribute value on.
   * @param attributeName - The attribute name to set.
   * @param value - The value of the attribute to set.
   * @remarks
   * If the value is `null` or `undefined`, the attribute is removed, otherwise
   * it is set to the provided value using the standard `setAttribute` API.
   */
  setAttribute(element, attributeName, value) {
    if (value === null || value === void 0) {
      element.removeAttribute(attributeName);
    } else {
      element.setAttribute(attributeName, value);
    }
  },
  /**
   * Sets a boolean attribute value.
   * @param element - The element to set the boolean attribute value on.
   * @param attributeName - The attribute name to set.
   * @param value - The value of the attribute to set.
   * @remarks
   * If the value is true, the attribute is added; otherwise it is removed.
   */
  setBooleanAttribute(element, attributeName, value) {
    value ? element.setAttribute(attributeName, "") : element.removeAttribute(attributeName);
  },
  /**
   * Removes all the child nodes of the provided parent node.
   * @param parent - The node to remove the children from.
   */
  removeChildNodes(parent) {
    for (let child = parent.firstChild; child !== null; child = parent.firstChild) {
      parent.removeChild(child);
    }
  },
  /**
   * Creates a TreeWalker configured to walk a template fragment.
   * @param fragment - The fragment to walk.
   */
  createTemplateWalker(fragment) {
    return document.createTreeWalker(
      fragment,
      133,
      // element, text, comment
      null,
      false
    );
  }
});

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/observation/notifier.js
var SubscriberSet = class {
  /**
   * Creates an instance of SubscriberSet for the specified source.
   * @param source - The object source that subscribers will receive notifications from.
   * @param initialSubscriber - An initial subscriber to changes.
   */
  constructor(source, initialSubscriber) {
    this.sub1 = void 0;
    this.sub2 = void 0;
    this.spillover = void 0;
    this.source = source;
    this.sub1 = initialSubscriber;
  }
  /**
   * Checks whether the provided subscriber has been added to this set.
   * @param subscriber - The subscriber to test for inclusion in this set.
   */
  has(subscriber) {
    return this.spillover === void 0 ? this.sub1 === subscriber || this.sub2 === subscriber : this.spillover.indexOf(subscriber) !== -1;
  }
  /**
   * Subscribes to notification of changes in an object's state.
   * @param subscriber - The object that is subscribing for change notification.
   */
  subscribe(subscriber) {
    const spillover = this.spillover;
    if (spillover === void 0) {
      if (this.has(subscriber)) {
        return;
      }
      if (this.sub1 === void 0) {
        this.sub1 = subscriber;
        return;
      }
      if (this.sub2 === void 0) {
        this.sub2 = subscriber;
        return;
      }
      this.spillover = [this.sub1, this.sub2, subscriber];
      this.sub1 = void 0;
      this.sub2 = void 0;
    } else {
      const index = spillover.indexOf(subscriber);
      if (index === -1) {
        spillover.push(subscriber);
      }
    }
  }
  /**
   * Unsubscribes from notification of changes in an object's state.
   * @param subscriber - The object that is unsubscribing from change notification.
   */
  unsubscribe(subscriber) {
    const spillover = this.spillover;
    if (spillover === void 0) {
      if (this.sub1 === subscriber) {
        this.sub1 = void 0;
      } else if (this.sub2 === subscriber) {
        this.sub2 = void 0;
      }
    } else {
      const index = spillover.indexOf(subscriber);
      if (index !== -1) {
        spillover.splice(index, 1);
      }
    }
  }
  /**
   * Notifies all subscribers.
   * @param args - Data passed along to subscribers during notification.
   */
  notify(args) {
    const spillover = this.spillover;
    const source = this.source;
    if (spillover === void 0) {
      const sub1 = this.sub1;
      const sub2 = this.sub2;
      if (sub1 !== void 0) {
        sub1.handleChange(source, args);
      }
      if (sub2 !== void 0) {
        sub2.handleChange(source, args);
      }
    } else {
      for (let i = 0, ii = spillover.length; i < ii; ++i) {
        spillover[i].handleChange(source, args);
      }
    }
  }
};
var PropertyChangeNotifier = class {
  /**
   * Creates an instance of PropertyChangeNotifier for the specified source.
   * @param source - The object source that subscribers will receive notifications from.
   */
  constructor(source) {
    this.subscribers = {};
    this.sourceSubscribers = null;
    this.source = source;
  }
  /**
   * Notifies all subscribers, based on the specified property.
   * @param propertyName - The property name, passed along to subscribers during notification.
   */
  notify(propertyName) {
    var _a;
    const subscribers = this.subscribers[propertyName];
    if (subscribers !== void 0) {
      subscribers.notify(propertyName);
    }
    (_a = this.sourceSubscribers) === null || _a === void 0 ? void 0 : _a.notify(propertyName);
  }
  /**
   * Subscribes to notification of changes in an object's state.
   * @param subscriber - The object that is subscribing for change notification.
   * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
   */
  subscribe(subscriber, propertyToWatch) {
    var _a;
    if (propertyToWatch) {
      let subscribers = this.subscribers[propertyToWatch];
      if (subscribers === void 0) {
        this.subscribers[propertyToWatch] = subscribers = new SubscriberSet(this.source);
      }
      subscribers.subscribe(subscriber);
    } else {
      this.sourceSubscribers = (_a = this.sourceSubscribers) !== null && _a !== void 0 ? _a : new SubscriberSet(this.source);
      this.sourceSubscribers.subscribe(subscriber);
    }
  }
  /**
   * Unsubscribes from notification of changes in an object's state.
   * @param subscriber - The object that is unsubscribing from change notification.
   * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
   */
  unsubscribe(subscriber, propertyToUnwatch) {
    var _a;
    if (propertyToUnwatch) {
      const subscribers = this.subscribers[propertyToUnwatch];
      if (subscribers !== void 0) {
        subscribers.unsubscribe(subscriber);
      }
    } else {
      (_a = this.sourceSubscribers) === null || _a === void 0 ? void 0 : _a.unsubscribe(subscriber);
    }
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/observation/observable.js
var Observable = FAST.getById(2, () => {
  const volatileRegex = /(:|&&|\|\||if)/;
  const notifierLookup = /* @__PURE__ */ new WeakMap();
  const queueUpdate = DOM.queueUpdate;
  let watcher = void 0;
  let createArrayObserver = (array) => {
    throw new Error("Must call enableArrayObservation before observing arrays.");
  };
  function getNotifier(source) {
    let found = source.$fastController || notifierLookup.get(source);
    if (found === void 0) {
      if (Array.isArray(source)) {
        found = createArrayObserver(source);
      } else {
        notifierLookup.set(source, found = new PropertyChangeNotifier(source));
      }
    }
    return found;
  }
  const getAccessors = createMetadataLocator();
  class DefaultObservableAccessor {
    constructor(name) {
      this.name = name;
      this.field = `_${name}`;
      this.callback = `${name}Changed`;
    }
    getValue(source) {
      if (watcher !== void 0) {
        watcher.watch(source, this.name);
      }
      return source[this.field];
    }
    setValue(source, newValue) {
      const field = this.field;
      const oldValue = source[field];
      if (oldValue !== newValue) {
        source[field] = newValue;
        const callback = source[this.callback];
        if (typeof callback === "function") {
          callback.call(source, oldValue, newValue);
        }
        getNotifier(source).notify(this.name);
      }
    }
  }
  class BindingObserverImplementation extends SubscriberSet {
    constructor(binding, initialSubscriber, isVolatileBinding = false) {
      super(binding, initialSubscriber);
      this.binding = binding;
      this.isVolatileBinding = isVolatileBinding;
      this.needsRefresh = true;
      this.needsQueue = true;
      this.first = this;
      this.last = null;
      this.propertySource = void 0;
      this.propertyName = void 0;
      this.notifier = void 0;
      this.next = void 0;
    }
    observe(source, context) {
      if (this.needsRefresh && this.last !== null) {
        this.disconnect();
      }
      const previousWatcher = watcher;
      watcher = this.needsRefresh ? this : void 0;
      this.needsRefresh = this.isVolatileBinding;
      const result = this.binding(source, context);
      watcher = previousWatcher;
      return result;
    }
    disconnect() {
      if (this.last !== null) {
        let current = this.first;
        while (current !== void 0) {
          current.notifier.unsubscribe(this, current.propertyName);
          current = current.next;
        }
        this.last = null;
        this.needsRefresh = this.needsQueue = true;
      }
    }
    watch(propertySource, propertyName) {
      const prev = this.last;
      const notifier = getNotifier(propertySource);
      const current = prev === null ? this.first : {};
      current.propertySource = propertySource;
      current.propertyName = propertyName;
      current.notifier = notifier;
      notifier.subscribe(this, propertyName);
      if (prev !== null) {
        if (!this.needsRefresh) {
          let prevValue;
          watcher = void 0;
          prevValue = prev.propertySource[prev.propertyName];
          watcher = this;
          if (propertySource === prevValue) {
            this.needsRefresh = true;
          }
        }
        prev.next = current;
      }
      this.last = current;
    }
    handleChange() {
      if (this.needsQueue) {
        this.needsQueue = false;
        queueUpdate(this);
      }
    }
    call() {
      if (this.last !== null) {
        this.needsQueue = true;
        this.notify(this);
      }
    }
    records() {
      let next = this.first;
      return {
        next: () => {
          const current = next;
          if (current === void 0) {
            return { value: void 0, done: true };
          } else {
            next = next.next;
            return {
              value: current,
              done: false
            };
          }
        },
        [Symbol.iterator]: function() {
          return this;
        }
      };
    }
  }
  return Object.freeze({
    /**
     * @internal
     * @param factory - The factory used to create array observers.
     */
    setArrayObserverFactory(factory) {
      createArrayObserver = factory;
    },
    /**
     * Gets a notifier for an object or Array.
     * @param source - The object or Array to get the notifier for.
     */
    getNotifier,
    /**
     * Records a property change for a source object.
     * @param source - The object to record the change against.
     * @param propertyName - The property to track as changed.
     */
    track(source, propertyName) {
      if (watcher !== void 0) {
        watcher.watch(source, propertyName);
      }
    },
    /**
     * Notifies watchers that the currently executing property getter or function is volatile
     * with respect to its observable dependencies.
     */
    trackVolatile() {
      if (watcher !== void 0) {
        watcher.needsRefresh = true;
      }
    },
    /**
     * Notifies subscribers of a source object of changes.
     * @param source - the object to notify of changes.
     * @param args - The change args to pass to subscribers.
     */
    notify(source, args) {
      getNotifier(source).notify(args);
    },
    /**
     * Defines an observable property on an object or prototype.
     * @param target - The target object to define the observable on.
     * @param nameOrAccessor - The name of the property to define as observable;
     * or a custom accessor that specifies the property name and accessor implementation.
     */
    defineProperty(target2, nameOrAccessor) {
      if (typeof nameOrAccessor === "string") {
        nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
      }
      getAccessors(target2).push(nameOrAccessor);
      Reflect.defineProperty(target2, nameOrAccessor.name, {
        enumerable: true,
        get: function() {
          return nameOrAccessor.getValue(this);
        },
        set: function(newValue) {
          nameOrAccessor.setValue(this, newValue);
        }
      });
    },
    /**
     * Finds all the observable accessors defined on the target,
     * including its prototype chain.
     * @param target - The target object to search for accessor on.
     */
    getAccessors,
    /**
     * Creates a {@link BindingObserver} that can watch the
     * provided {@link Binding} for changes.
     * @param binding - The binding to observe.
     * @param initialSubscriber - An initial subscriber to changes in the binding value.
     * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
     */
    binding(binding, initialSubscriber, isVolatileBinding = this.isVolatileBinding(binding)) {
      return new BindingObserverImplementation(binding, initialSubscriber, isVolatileBinding);
    },
    /**
     * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
     * on every evaluation of the value.
     * @param binding - The binding to inspect.
     */
    isVolatileBinding(binding) {
      return volatileRegex.test(binding.toString());
    }
  });
});
function observable(target2, nameOrAccessor) {
  Observable.defineProperty(target2, nameOrAccessor);
}
function volatile(target2, name, descriptor) {
  return Object.assign({}, descriptor, {
    get: function() {
      Observable.trackVolatile();
      return descriptor.get.apply(this);
    }
  });
}
var contextEvent = FAST.getById(3, () => {
  let current = null;
  return {
    get() {
      return current;
    },
    set(event) {
      current = event;
    }
  };
});
var ExecutionContext = class {
  constructor() {
    this.index = 0;
    this.length = 0;
    this.parent = null;
    this.parentContext = null;
  }
  /**
   * The current event within an event handler.
   */
  get event() {
    return contextEvent.get();
  }
  /**
   * Indicates whether the current item within a repeat context
   * has an even index.
   */
  get isEven() {
    return this.index % 2 === 0;
  }
  /**
   * Indicates whether the current item within a repeat context
   * has an odd index.
   */
  get isOdd() {
    return this.index % 2 !== 0;
  }
  /**
   * Indicates whether the current item within a repeat context
   * is the first item in the collection.
   */
  get isFirst() {
    return this.index === 0;
  }
  /**
   * Indicates whether the current item within a repeat context
   * is somewhere in the middle of the collection.
   */
  get isInMiddle() {
    return !this.isFirst && !this.isLast;
  }
  /**
   * Indicates whether the current item within a repeat context
   * is the last item in the collection.
   */
  get isLast() {
    return this.index === this.length - 1;
  }
  /**
   * Sets the event for the current execution context.
   * @param event - The event to set.
   * @internal
   */
  static setEvent(event) {
    contextEvent.set(event);
  }
};
Observable.defineProperty(ExecutionContext.prototype, "index");
Observable.defineProperty(ExecutionContext.prototype, "length");
var defaultExecutionContext = Object.seal(new ExecutionContext());

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/html-directive.js
var HTMLDirective = class {
  constructor() {
    this.targetIndex = 0;
  }
};
var TargetedHTMLDirective = class extends HTMLDirective {
  constructor() {
    super(...arguments);
    this.createPlaceholder = DOM.createInterpolationPlaceholder;
  }
};
var AttachedBehaviorHTMLDirective = class extends HTMLDirective {
  /**
   *
   * @param name - The name of the behavior; used as a custom attribute on the element.
   * @param behavior - The behavior to instantiate and attach to the element.
   * @param options - Options to pass to the behavior during creation.
   */
  constructor(name, behavior, options) {
    super();
    this.name = name;
    this.behavior = behavior;
    this.options = options;
  }
  /**
   * Creates a placeholder string based on the directive's index within the template.
   * @param index - The index of the directive within the template.
   * @remarks
   * Creates a custom attribute placeholder.
   */
  createPlaceholder(index) {
    return DOM.createCustomAttributePlaceholder(this.name, index);
  }
  /**
   * Creates a behavior for the provided target node.
   * @param target - The node instance to create the behavior for.
   * @remarks
   * Creates an instance of the `behavior` type this directive was constructed with
   * and passes the target and options to that `behavior`'s constructor.
   */
  createBehavior(target2) {
    return new this.behavior(target2, this.options);
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/binding.js
function normalBind(source, context) {
  this.source = source;
  this.context = context;
  if (this.bindingObserver === null) {
    this.bindingObserver = Observable.binding(this.binding, this, this.isBindingVolatile);
  }
  this.updateTarget(this.bindingObserver.observe(source, context));
}
function triggerBind(source, context) {
  this.source = source;
  this.context = context;
  this.target.addEventListener(this.targetName, this);
}
function normalUnbind() {
  this.bindingObserver.disconnect();
  this.source = null;
  this.context = null;
}
function contentUnbind() {
  this.bindingObserver.disconnect();
  this.source = null;
  this.context = null;
  const view = this.target.$fastView;
  if (view !== void 0 && view.isComposed) {
    view.unbind();
    view.needsBindOnly = true;
  }
}
function triggerUnbind() {
  this.target.removeEventListener(this.targetName, this);
  this.source = null;
  this.context = null;
}
function updateAttributeTarget(value) {
  DOM.setAttribute(this.target, this.targetName, value);
}
function updateBooleanAttributeTarget(value) {
  DOM.setBooleanAttribute(this.target, this.targetName, value);
}
function updateContentTarget(value) {
  if (value === null || value === void 0) {
    value = "";
  }
  if (value.create) {
    this.target.textContent = "";
    let view = this.target.$fastView;
    if (view === void 0) {
      view = value.create();
    } else {
      if (this.target.$fastTemplate !== value) {
        if (view.isComposed) {
          view.remove();
          view.unbind();
        }
        view = value.create();
      }
    }
    if (!view.isComposed) {
      view.isComposed = true;
      view.bind(this.source, this.context);
      view.insertBefore(this.target);
      this.target.$fastView = view;
      this.target.$fastTemplate = value;
    } else if (view.needsBindOnly) {
      view.needsBindOnly = false;
      view.bind(this.source, this.context);
    }
  } else {
    const view = this.target.$fastView;
    if (view !== void 0 && view.isComposed) {
      view.isComposed = false;
      view.remove();
      if (view.needsBindOnly) {
        view.needsBindOnly = false;
      } else {
        view.unbind();
      }
    }
    this.target.textContent = value;
  }
}
function updatePropertyTarget(value) {
  this.target[this.targetName] = value;
}
function updateClassTarget(value) {
  const classVersions = this.classVersions || /* @__PURE__ */ Object.create(null);
  const target2 = this.target;
  let version = this.version || 0;
  if (value !== null && value !== void 0 && value.length) {
    const names = value.split(/\s+/);
    for (let i = 0, ii = names.length; i < ii; ++i) {
      const currentName = names[i];
      if (currentName === "") {
        continue;
      }
      classVersions[currentName] = version;
      target2.classList.add(currentName);
    }
  }
  this.classVersions = classVersions;
  this.version = version + 1;
  if (version === 0) {
    return;
  }
  version -= 1;
  for (const name in classVersions) {
    if (classVersions[name] === version) {
      target2.classList.remove(name);
    }
  }
}
var HTMLBindingDirective = class extends TargetedHTMLDirective {
  /**
   * Creates an instance of BindingDirective.
   * @param binding - A binding that returns the data used to update the DOM.
   */
  constructor(binding) {
    super();
    this.binding = binding;
    this.bind = normalBind;
    this.unbind = normalUnbind;
    this.updateTarget = updateAttributeTarget;
    this.isBindingVolatile = Observable.isVolatileBinding(this.binding);
  }
  /**
   * Gets/sets the name of the attribute or property that this
   * binding is targeting.
   */
  get targetName() {
    return this.originalTargetName;
  }
  set targetName(value) {
    this.originalTargetName = value;
    if (value === void 0) {
      return;
    }
    switch (value[0]) {
      case ":":
        this.cleanedTargetName = value.substr(1);
        this.updateTarget = updatePropertyTarget;
        if (this.cleanedTargetName === "innerHTML") {
          const binding = this.binding;
          this.binding = (s, c) => DOM.createHTML(binding(s, c));
        }
        break;
      case "?":
        this.cleanedTargetName = value.substr(1);
        this.updateTarget = updateBooleanAttributeTarget;
        break;
      case "@":
        this.cleanedTargetName = value.substr(1);
        this.bind = triggerBind;
        this.unbind = triggerUnbind;
        break;
      default:
        this.cleanedTargetName = value;
        if (value === "class") {
          this.updateTarget = updateClassTarget;
        }
        break;
    }
  }
  /**
   * Makes this binding target the content of an element rather than
   * a particular attribute or property.
   */
  targetAtContent() {
    this.updateTarget = updateContentTarget;
    this.unbind = contentUnbind;
  }
  /**
   * Creates the runtime BindingBehavior instance based on the configuration
   * information stored in the BindingDirective.
   * @param target - The target node that the binding behavior should attach to.
   */
  createBehavior(target2) {
    return new BindingBehavior(target2, this.binding, this.isBindingVolatile, this.bind, this.unbind, this.updateTarget, this.cleanedTargetName);
  }
};
var BindingBehavior = class {
  /**
   * Creates an instance of BindingBehavior.
   * @param target - The target of the data updates.
   * @param binding - The binding that returns the latest value for an update.
   * @param isBindingVolatile - Indicates whether the binding has volatile dependencies.
   * @param bind - The operation to perform during binding.
   * @param unbind - The operation to perform during unbinding.
   * @param updateTarget - The operation to perform when updating.
   * @param targetName - The name of the target attribute or property to update.
   */
  constructor(target2, binding, isBindingVolatile, bind, unbind, updateTarget, targetName) {
    this.source = null;
    this.context = null;
    this.bindingObserver = null;
    this.target = target2;
    this.binding = binding;
    this.isBindingVolatile = isBindingVolatile;
    this.bind = bind;
    this.unbind = unbind;
    this.updateTarget = updateTarget;
    this.targetName = targetName;
  }
  /** @internal */
  handleChange() {
    this.updateTarget(this.bindingObserver.observe(this.source, this.context));
  }
  /** @internal */
  handleEvent(event) {
    ExecutionContext.setEvent(event);
    const result = this.binding(this.source, this.context);
    ExecutionContext.setEvent(null);
    if (result !== true) {
      event.preventDefault();
    }
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/compiler.js
var sharedContext = null;
var CompilationContext = class _CompilationContext {
  addFactory(factory) {
    factory.targetIndex = this.targetIndex;
    this.behaviorFactories.push(factory);
  }
  captureContentBinding(directive) {
    directive.targetAtContent();
    this.addFactory(directive);
  }
  reset() {
    this.behaviorFactories = [];
    this.targetIndex = -1;
  }
  release() {
    sharedContext = this;
  }
  static borrow(directives) {
    const shareable = sharedContext || new _CompilationContext();
    shareable.directives = directives;
    shareable.reset();
    sharedContext = null;
    return shareable;
  }
};
function createAggregateBinding(parts) {
  if (parts.length === 1) {
    return parts[0];
  }
  let targetName;
  const partCount = parts.length;
  const finalParts = parts.map((x) => {
    if (typeof x === "string") {
      return () => x;
    }
    targetName = x.targetName || targetName;
    return x.binding;
  });
  const binding = (scope, context) => {
    let output = "";
    for (let i = 0; i < partCount; ++i) {
      output += finalParts[i](scope, context);
    }
    return output;
  };
  const directive = new HTMLBindingDirective(binding);
  directive.targetName = targetName;
  return directive;
}
var interpolationEndLength = _interpolationEnd.length;
function parseContent(context, value) {
  const valueParts = value.split(_interpolationStart);
  if (valueParts.length === 1) {
    return null;
  }
  const bindingParts = [];
  for (let i = 0, ii = valueParts.length; i < ii; ++i) {
    const current = valueParts[i];
    const index = current.indexOf(_interpolationEnd);
    let literal;
    if (index === -1) {
      literal = current;
    } else {
      const directiveIndex = parseInt(current.substring(0, index));
      bindingParts.push(context.directives[directiveIndex]);
      literal = current.substring(index + interpolationEndLength);
    }
    if (literal !== "") {
      bindingParts.push(literal);
    }
  }
  return bindingParts;
}
function compileAttributes(context, node, includeBasicValues = false) {
  const attributes = node.attributes;
  for (let i = 0, ii = attributes.length; i < ii; ++i) {
    const attr2 = attributes[i];
    const attrValue = attr2.value;
    const parseResult = parseContent(context, attrValue);
    let result = null;
    if (parseResult === null) {
      if (includeBasicValues) {
        result = new HTMLBindingDirective(() => attrValue);
        result.targetName = attr2.name;
      }
    } else {
      result = createAggregateBinding(parseResult);
    }
    if (result !== null) {
      node.removeAttributeNode(attr2);
      i--;
      ii--;
      context.addFactory(result);
    }
  }
}
function compileContent(context, node, walker2) {
  const parseResult = parseContent(context, node.textContent);
  if (parseResult !== null) {
    let lastNode = node;
    for (let i = 0, ii = parseResult.length; i < ii; ++i) {
      const currentPart = parseResult[i];
      const currentNode = i === 0 ? node : lastNode.parentNode.insertBefore(document.createTextNode(""), lastNode.nextSibling);
      if (typeof currentPart === "string") {
        currentNode.textContent = currentPart;
      } else {
        currentNode.textContent = " ";
        context.captureContentBinding(currentPart);
      }
      lastNode = currentNode;
      context.targetIndex++;
      if (currentNode !== node) {
        walker2.nextNode();
      }
    }
    context.targetIndex--;
  }
}
function compileTemplate(template, directives) {
  const fragment = template.content;
  document.adoptNode(fragment);
  const context = CompilationContext.borrow(directives);
  compileAttributes(context, template, true);
  const hostBehaviorFactories = context.behaviorFactories;
  context.reset();
  const walker2 = DOM.createTemplateWalker(fragment);
  let node;
  while (node = walker2.nextNode()) {
    context.targetIndex++;
    switch (node.nodeType) {
      case 1:
        compileAttributes(context, node);
        break;
      case 3:
        compileContent(context, node, walker2);
        break;
      case 8:
        if (DOM.isMarker(node)) {
          context.addFactory(directives[DOM.extractDirectiveIndexFromMarker(node)]);
        }
    }
  }
  let targetOffset = 0;
  if (
    // If the first node in a fragment is a marker, that means it's an unstable first node,
    // because something like a when, repeat, etc. could add nodes before the marker.
    // To mitigate this, we insert a stable first node. However, if we insert a node,
    // that will alter the result of the TreeWalker. So, we also need to offset the target index.
    DOM.isMarker(fragment.firstChild) || // Or if there is only one node and a directive, it means the template's content
    // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
    // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
    fragment.childNodes.length === 1 && directives.length
  ) {
    fragment.insertBefore(document.createComment(""), fragment.firstChild);
    targetOffset = -1;
  }
  const viewBehaviorFactories = context.behaviorFactories;
  context.release();
  return {
    fragment,
    viewBehaviorFactories,
    hostBehaviorFactories,
    targetOffset
  };
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/view.js
var range = document.createRange();
var HTMLView = class {
  /**
   * Constructs an instance of HTMLView.
   * @param fragment - The html fragment that contains the nodes for this view.
   * @param behaviors - The behaviors to be applied to this view.
   */
  constructor(fragment, behaviors) {
    this.fragment = fragment;
    this.behaviors = behaviors;
    this.source = null;
    this.context = null;
    this.firstChild = fragment.firstChild;
    this.lastChild = fragment.lastChild;
  }
  /**
   * Appends the view's DOM nodes to the referenced node.
   * @param node - The parent node to append the view's DOM nodes to.
   */
  appendTo(node) {
    node.appendChild(this.fragment);
  }
  /**
   * Inserts the view's DOM nodes before the referenced node.
   * @param node - The node to insert the view's DOM before.
   */
  insertBefore(node) {
    if (this.fragment.hasChildNodes()) {
      node.parentNode.insertBefore(this.fragment, node);
    } else {
      const end = this.lastChild;
      if (node.previousSibling === end)
        return;
      const parentNode = node.parentNode;
      let current = this.firstChild;
      let next;
      while (current !== end) {
        next = current.nextSibling;
        parentNode.insertBefore(current, node);
        current = next;
      }
      parentNode.insertBefore(end, node);
    }
  }
  /**
   * Removes the view's DOM nodes.
   * The nodes are not disposed and the view can later be re-inserted.
   */
  remove() {
    const fragment = this.fragment;
    const end = this.lastChild;
    let current = this.firstChild;
    let next;
    while (current !== end) {
      next = current.nextSibling;
      fragment.appendChild(current);
      current = next;
    }
    fragment.appendChild(end);
  }
  /**
   * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
   * Once a view has been disposed, it cannot be inserted or bound again.
   */
  dispose() {
    const parent = this.firstChild.parentNode;
    const end = this.lastChild;
    let current = this.firstChild;
    let next;
    while (current !== end) {
      next = current.nextSibling;
      parent.removeChild(current);
      current = next;
    }
    parent.removeChild(end);
    const behaviors = this.behaviors;
    const oldSource = this.source;
    for (let i = 0, ii = behaviors.length; i < ii; ++i) {
      behaviors[i].unbind(oldSource);
    }
  }
  /**
   * Binds a view's behaviors to its binding source.
   * @param source - The binding source for the view's binding behaviors.
   * @param context - The execution context to run the behaviors within.
   */
  bind(source, context) {
    const behaviors = this.behaviors;
    if (this.source === source) {
      return;
    } else if (this.source !== null) {
      const oldSource = this.source;
      this.source = source;
      this.context = context;
      for (let i = 0, ii = behaviors.length; i < ii; ++i) {
        const current = behaviors[i];
        current.unbind(oldSource);
        current.bind(source, context);
      }
    } else {
      this.source = source;
      this.context = context;
      for (let i = 0, ii = behaviors.length; i < ii; ++i) {
        behaviors[i].bind(source, context);
      }
    }
  }
  /**
   * Unbinds a view's behaviors from its binding source.
   */
  unbind() {
    if (this.source === null) {
      return;
    }
    const behaviors = this.behaviors;
    const oldSource = this.source;
    for (let i = 0, ii = behaviors.length; i < ii; ++i) {
      behaviors[i].unbind(oldSource);
    }
    this.source = null;
  }
  /**
   * Efficiently disposes of a contiguous range of synthetic view instances.
   * @param views - A contiguous range of views to be disposed.
   */
  static disposeContiguousBatch(views) {
    if (views.length === 0) {
      return;
    }
    range.setStartBefore(views[0].firstChild);
    range.setEndAfter(views[views.length - 1].lastChild);
    range.deleteContents();
    for (let i = 0, ii = views.length; i < ii; ++i) {
      const view = views[i];
      const behaviors = view.behaviors;
      const oldSource = view.source;
      for (let j = 0, jj = behaviors.length; j < jj; ++j) {
        behaviors[j].unbind(oldSource);
      }
    }
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/template.js
var ViewTemplate = class {
  /**
   * Creates an instance of ViewTemplate.
   * @param html - The html representing what this template will instantiate, including placeholders for directives.
   * @param directives - The directives that will be connected to placeholders in the html.
   */
  constructor(html3, directives) {
    this.behaviorCount = 0;
    this.hasHostBehaviors = false;
    this.fragment = null;
    this.targetOffset = 0;
    this.viewBehaviorFactories = null;
    this.hostBehaviorFactories = null;
    this.html = html3;
    this.directives = directives;
  }
  /**
   * Creates an HTMLView instance based on this template definition.
   * @param hostBindingTarget - The element that host behaviors will be bound to.
   */
  create(hostBindingTarget) {
    if (this.fragment === null) {
      let template;
      const html3 = this.html;
      if (typeof html3 === "string") {
        template = document.createElement("template");
        template.innerHTML = DOM.createHTML(html3);
        const fec = template.content.firstElementChild;
        if (fec !== null && fec.tagName === "TEMPLATE") {
          template = fec;
        }
      } else {
        template = html3;
      }
      const result = compileTemplate(template, this.directives);
      this.fragment = result.fragment;
      this.viewBehaviorFactories = result.viewBehaviorFactories;
      this.hostBehaviorFactories = result.hostBehaviorFactories;
      this.targetOffset = result.targetOffset;
      this.behaviorCount = this.viewBehaviorFactories.length + this.hostBehaviorFactories.length;
      this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;
    }
    const fragment = this.fragment.cloneNode(true);
    const viewFactories = this.viewBehaviorFactories;
    const behaviors = new Array(this.behaviorCount);
    const walker2 = DOM.createTemplateWalker(fragment);
    let behaviorIndex = 0;
    let targetIndex = this.targetOffset;
    let node = walker2.nextNode();
    for (let ii = viewFactories.length; behaviorIndex < ii; ++behaviorIndex) {
      const factory = viewFactories[behaviorIndex];
      const factoryIndex = factory.targetIndex;
      while (node !== null) {
        if (targetIndex === factoryIndex) {
          behaviors[behaviorIndex] = factory.createBehavior(node);
          break;
        } else {
          node = walker2.nextNode();
          targetIndex++;
        }
      }
    }
    if (this.hasHostBehaviors) {
      const hostFactories = this.hostBehaviorFactories;
      for (let i = 0, ii = hostFactories.length; i < ii; ++i, ++behaviorIndex) {
        behaviors[behaviorIndex] = hostFactories[i].createBehavior(hostBindingTarget);
      }
    }
    return new HTMLView(fragment, behaviors);
  }
  /**
   * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
   * @param source - The data source to bind the template to.
   * @param host - The Element where the template will be rendered.
   * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
   * host that the template is being attached to.
   */
  render(source, host, hostBindingTarget) {
    if (typeof host === "string") {
      host = document.getElementById(host);
    }
    if (hostBindingTarget === void 0) {
      hostBindingTarget = host;
    }
    const view = this.create(hostBindingTarget);
    view.bind(source, defaultExecutionContext);
    view.appendTo(host);
    return view;
  }
};
var lastAttributeNameRegex = (
  /* eslint-disable-next-line no-control-regex */
  /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/
);
function html2(strings, ...values) {
  const directives = [];
  let html3 = "";
  for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
    const currentString = strings[i];
    let value = values[i];
    html3 += currentString;
    if (value instanceof ViewTemplate) {
      const template = value;
      value = () => template;
    }
    if (typeof value === "function") {
      value = new HTMLBindingDirective(value);
    }
    if (value instanceof TargetedHTMLDirective) {
      const match = lastAttributeNameRegex.exec(currentString);
      if (match !== null) {
        value.targetName = match[2];
      }
    }
    if (value instanceof HTMLDirective) {
      html3 += value.createPlaceholder(directives.length);
      directives.push(value);
    } else {
      html3 += value;
    }
  }
  html3 += strings[strings.length - 1];
  return new ViewTemplate(html3, directives);
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/styles/element-styles.js
var ElementStyles = class {
  constructor() {
    this.targets = /* @__PURE__ */ new WeakSet();
  }
  /** @internal */
  addStylesTo(target2) {
    this.targets.add(target2);
  }
  /** @internal */
  removeStylesFrom(target2) {
    this.targets.delete(target2);
  }
  /** @internal */
  isAttachedTo(target2) {
    return this.targets.has(target2);
  }
  /**
   * Associates behaviors with this set of styles.
   * @param behaviors - The behaviors to associate.
   */
  withBehaviors(...behaviors) {
    this.behaviors = this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);
    return this;
  }
};
ElementStyles.create = (() => {
  if (DOM.supportsAdoptedStyleSheets) {
    const styleSheetCache = /* @__PURE__ */ new Map();
    return (styles) => (
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      new AdoptedStyleSheetsStyles(styles, styleSheetCache)
    );
  }
  return (styles) => new StyleElementStyles(styles);
})();
function reduceStyles(styles) {
  return styles.map((x) => x instanceof ElementStyles ? reduceStyles(x.styles) : [x]).reduce((prev, curr) => prev.concat(curr), []);
}
function reduceBehaviors(styles) {
  return styles.map((x) => x instanceof ElementStyles ? x.behaviors : null).reduce((prev, curr) => {
    if (curr === null) {
      return prev;
    }
    if (prev === null) {
      prev = [];
    }
    return prev.concat(curr);
  }, null);
}
var prependToAdoptedStyleSheetsSymbol = Symbol("prependToAdoptedStyleSheets");
function separateSheetsToPrepend(sheets) {
  const prepend = [];
  const append = [];
  sheets.forEach((x) => (x[prependToAdoptedStyleSheetsSymbol] ? prepend : append).push(x));
  return { prepend, append };
}
var addAdoptedStyleSheets = (target2, sheets) => {
  const { prepend, append } = separateSheetsToPrepend(sheets);
  target2.adoptedStyleSheets = [...prepend, ...target2.adoptedStyleSheets, ...append];
};
var removeAdoptedStyleSheets = (target2, sheets) => {
  target2.adoptedStyleSheets = target2.adoptedStyleSheets.filter((x) => sheets.indexOf(x) === -1);
};
if (DOM.supportsAdoptedStyleSheets) {
  try {
    document.adoptedStyleSheets.push();
    document.adoptedStyleSheets.splice();
    addAdoptedStyleSheets = (target2, sheets) => {
      const { prepend, append } = separateSheetsToPrepend(sheets);
      target2.adoptedStyleSheets.splice(0, 0, ...prepend);
      target2.adoptedStyleSheets.push(...append);
    };
    removeAdoptedStyleSheets = (target2, sheets) => {
      for (const sheet of sheets) {
        const index = target2.adoptedStyleSheets.indexOf(sheet);
        if (index !== -1) {
          target2.adoptedStyleSheets.splice(index, 1);
        }
      }
    };
  } catch (e) {
  }
}
var AdoptedStyleSheetsStyles = class extends ElementStyles {
  constructor(styles, styleSheetCache) {
    super();
    this.styles = styles;
    this.styleSheetCache = styleSheetCache;
    this._styleSheets = void 0;
    this.behaviors = reduceBehaviors(styles);
  }
  get styleSheets() {
    if (this._styleSheets === void 0) {
      const styles = this.styles;
      const styleSheetCache = this.styleSheetCache;
      this._styleSheets = reduceStyles(styles).map((x) => {
        if (x instanceof CSSStyleSheet) {
          return x;
        }
        let sheet = styleSheetCache.get(x);
        if (sheet === void 0) {
          sheet = new CSSStyleSheet();
          sheet.replaceSync(x);
          styleSheetCache.set(x, sheet);
        }
        return sheet;
      });
    }
    return this._styleSheets;
  }
  addStylesTo(target2) {
    addAdoptedStyleSheets(target2, this.styleSheets);
    super.addStylesTo(target2);
  }
  removeStylesFrom(target2) {
    removeAdoptedStyleSheets(target2, this.styleSheets);
    super.removeStylesFrom(target2);
  }
};
var styleClassId = 0;
function getNextStyleClass() {
  return `fast-style-class-${++styleClassId}`;
}
var StyleElementStyles = class extends ElementStyles {
  constructor(styles) {
    super();
    this.styles = styles;
    this.behaviors = null;
    this.behaviors = reduceBehaviors(styles);
    this.styleSheets = reduceStyles(styles);
    this.styleClass = getNextStyleClass();
  }
  addStylesTo(target2) {
    const styleSheets = this.styleSheets;
    const styleClass = this.styleClass;
    target2 = this.normalizeTarget(target2);
    for (let i = 0; i < styleSheets.length; i++) {
      const element = document.createElement("style");
      element.innerHTML = styleSheets[i];
      element.className = styleClass;
      target2.append(element);
    }
    super.addStylesTo(target2);
  }
  removeStylesFrom(target2) {
    target2 = this.normalizeTarget(target2);
    const styles = target2.querySelectorAll(`.${this.styleClass}`);
    for (let i = 0, ii = styles.length; i < ii; ++i) {
      target2.removeChild(styles[i]);
    }
    super.removeStylesFrom(target2);
  }
  isAttachedTo(target2) {
    return super.isAttachedTo(this.normalizeTarget(target2));
  }
  normalizeTarget(target2) {
    return target2 === document ? document.body : target2;
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/components/attributes.js
var AttributeConfiguration = Object.freeze({
  /**
   * Locates all attribute configurations associated with a type.
   */
  locate: createMetadataLocator()
});
var booleanConverter = {
  toView(value) {
    return value ? "true" : "false";
  },
  fromView(value) {
    if (value === null || value === void 0 || value === "false" || value === false || value === 0) {
      return false;
    }
    return true;
  }
};
var nullableNumberConverter = {
  toView(value) {
    if (value === null || value === void 0) {
      return null;
    }
    const number = value * 1;
    return isNaN(number) ? null : number.toString();
  },
  fromView(value) {
    if (value === null || value === void 0) {
      return null;
    }
    const number = value * 1;
    return isNaN(number) ? null : number;
  }
};
var AttributeDefinition = class _AttributeDefinition {
  /**
   * Creates an instance of AttributeDefinition.
   * @param Owner - The class constructor that owns this attribute.
   * @param name - The name of the property associated with the attribute.
   * @param attribute - The name of the attribute in HTML.
   * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
   * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
   * to convert values to and from a DOM string.
   */
  constructor(Owner, name, attribute = name.toLowerCase(), mode = "reflect", converter) {
    this.guards = /* @__PURE__ */ new Set();
    this.Owner = Owner;
    this.name = name;
    this.attribute = attribute;
    this.mode = mode;
    this.converter = converter;
    this.fieldName = `_${name}`;
    this.callbackName = `${name}Changed`;
    this.hasCallback = this.callbackName in Owner.prototype;
    if (mode === "boolean" && converter === void 0) {
      this.converter = booleanConverter;
    }
  }
  /**
   * Sets the value of the attribute/property on the source element.
   * @param source - The source element to access.
   * @param value - The value to set the attribute/property to.
   */
  setValue(source, newValue) {
    const oldValue = source[this.fieldName];
    const converter = this.converter;
    if (converter !== void 0) {
      newValue = converter.fromView(newValue);
    }
    if (oldValue !== newValue) {
      source[this.fieldName] = newValue;
      this.tryReflectToAttribute(source);
      if (this.hasCallback) {
        source[this.callbackName](oldValue, newValue);
      }
      source.$fastController.notify(this.name);
    }
  }
  /**
   * Gets the value of the attribute/property on the source element.
   * @param source - The source element to access.
   */
  getValue(source) {
    Observable.track(source, this.name);
    return source[this.fieldName];
  }
  /** @internal */
  onAttributeChangedCallback(element, value) {
    if (this.guards.has(element)) {
      return;
    }
    this.guards.add(element);
    this.setValue(element, value);
    this.guards.delete(element);
  }
  tryReflectToAttribute(element) {
    const mode = this.mode;
    const guards = this.guards;
    if (guards.has(element) || mode === "fromView") {
      return;
    }
    DOM.queueUpdate(() => {
      guards.add(element);
      const latestValue = element[this.fieldName];
      switch (mode) {
        case "reflect":
          const converter = this.converter;
          DOM.setAttribute(element, this.attribute, converter !== void 0 ? converter.toView(latestValue) : latestValue);
          break;
        case "boolean":
          DOM.setBooleanAttribute(element, this.attribute, latestValue);
          break;
      }
      guards.delete(element);
    });
  }
  /**
   * Collects all attribute definitions associated with the owner.
   * @param Owner - The class constructor to collect attribute for.
   * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
   * @internal
   */
  static collect(Owner, ...attributeLists) {
    const attributes = [];
    attributeLists.push(AttributeConfiguration.locate(Owner));
    for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
      const list = attributeLists[i];
      if (list === void 0) {
        continue;
      }
      for (let j = 0, jj = list.length; j < jj; ++j) {
        const config = list[j];
        if (typeof config === "string") {
          attributes.push(new _AttributeDefinition(Owner, config));
        } else {
          attributes.push(new _AttributeDefinition(Owner, config.property, config.attribute, config.mode, config.converter));
        }
      }
    }
    return attributes;
  }
};
function attr(configOrTarget, prop) {
  let config;
  function decorator($target, $prop) {
    if (arguments.length > 1) {
      config.property = $prop;
    }
    AttributeConfiguration.locate($target.constructor).push(config);
  }
  if (arguments.length > 1) {
    config = {};
    decorator(configOrTarget, prop);
    return;
  }
  config = configOrTarget === void 0 ? {} : configOrTarget;
  return decorator;
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/components/fast-definitions.js
var defaultShadowOptions = { mode: "open" };
var defaultElementOptions = {};
var fastRegistry = FAST.getById(4, () => {
  const typeToDefinition = /* @__PURE__ */ new Map();
  return Object.freeze({
    register(definition) {
      if (typeToDefinition.has(definition.type)) {
        return false;
      }
      typeToDefinition.set(definition.type, definition);
      return true;
    },
    getByType(key) {
      return typeToDefinition.get(key);
    }
  });
});
var FASTElementDefinition = class {
  /**
   * Creates an instance of FASTElementDefinition.
   * @param type - The type this definition is being created for.
   * @param nameOrConfig - The name of the element to define or a config object
   * that describes the element to define.
   */
  constructor(type, nameOrConfig = type.definition) {
    if (typeof nameOrConfig === "string") {
      nameOrConfig = { name: nameOrConfig };
    }
    this.type = type;
    this.name = nameOrConfig.name;
    this.template = nameOrConfig.template;
    const attributes = AttributeDefinition.collect(type, nameOrConfig.attributes);
    const observedAttributes = new Array(attributes.length);
    const propertyLookup = {};
    const attributeLookup = {};
    for (let i = 0, ii = attributes.length; i < ii; ++i) {
      const current = attributes[i];
      observedAttributes[i] = current.attribute;
      propertyLookup[current.name] = current;
      attributeLookup[current.attribute] = current;
    }
    this.attributes = attributes;
    this.observedAttributes = observedAttributes;
    this.propertyLookup = propertyLookup;
    this.attributeLookup = attributeLookup;
    this.shadowOptions = nameOrConfig.shadowOptions === void 0 ? defaultShadowOptions : nameOrConfig.shadowOptions === null ? void 0 : Object.assign(Object.assign({}, defaultShadowOptions), nameOrConfig.shadowOptions);
    this.elementOptions = nameOrConfig.elementOptions === void 0 ? defaultElementOptions : Object.assign(Object.assign({}, defaultElementOptions), nameOrConfig.elementOptions);
    this.styles = nameOrConfig.styles === void 0 ? void 0 : Array.isArray(nameOrConfig.styles) ? ElementStyles.create(nameOrConfig.styles) : nameOrConfig.styles instanceof ElementStyles ? nameOrConfig.styles : ElementStyles.create([nameOrConfig.styles]);
  }
  /**
   * Indicates if this element has been defined in at least one registry.
   */
  get isDefined() {
    return !!fastRegistry.getByType(this.type);
  }
  /**
   * Defines a custom element based on this definition.
   * @param registry - The element registry to define the element in.
   */
  define(registry = customElements) {
    const type = this.type;
    if (fastRegistry.register(this)) {
      const attributes = this.attributes;
      const proto = type.prototype;
      for (let i = 0, ii = attributes.length; i < ii; ++i) {
        Observable.defineProperty(proto, attributes[i]);
      }
      Reflect.defineProperty(type, "observedAttributes", {
        value: this.observedAttributes,
        enumerable: true
      });
    }
    if (!registry.get(this.name)) {
      registry.define(this.name, type, this.elementOptions);
    }
    return this;
  }
};
FASTElementDefinition.forType = fastRegistry.getByType;

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/components/controller.js
var shadowRoots = /* @__PURE__ */ new WeakMap();
var defaultEventOptions = {
  bubbles: true,
  composed: true,
  cancelable: true
};
function getShadowRoot(element) {
  return element.shadowRoot || shadowRoots.get(element) || null;
}
var Controller = class _Controller extends PropertyChangeNotifier {
  /**
   * Creates a Controller to control the specified element.
   * @param element - The element to be controlled by this controller.
   * @param definition - The element definition metadata that instructs this
   * controller in how to handle rendering and other platform integrations.
   * @internal
   */
  constructor(element, definition) {
    super(element);
    this.boundObservables = null;
    this.behaviors = null;
    this.needsInitialization = true;
    this._template = null;
    this._styles = null;
    this._isConnected = false;
    this.$fastController = this;
    this.view = null;
    this.element = element;
    this.definition = definition;
    const shadowOptions = definition.shadowOptions;
    if (shadowOptions !== void 0) {
      const shadowRoot = element.attachShadow(shadowOptions);
      if (shadowOptions.mode === "closed") {
        shadowRoots.set(element, shadowRoot);
      }
    }
    const accessors = Observable.getAccessors(element);
    if (accessors.length > 0) {
      const boundObservables = this.boundObservables = /* @__PURE__ */ Object.create(null);
      for (let i = 0, ii = accessors.length; i < ii; ++i) {
        const propertyName = accessors[i].name;
        const value = element[propertyName];
        if (value !== void 0) {
          delete element[propertyName];
          boundObservables[propertyName] = value;
        }
      }
    }
  }
  /**
   * Indicates whether or not the custom element has been
   * connected to the document.
   */
  get isConnected() {
    Observable.track(this, "isConnected");
    return this._isConnected;
  }
  setIsConnected(value) {
    this._isConnected = value;
    Observable.notify(this, "isConnected");
  }
  /**
   * Gets/sets the template used to render the component.
   * @remarks
   * This value can only be accurately read after connect but can be set at any time.
   */
  get template() {
    return this._template;
  }
  set template(value) {
    if (this._template === value) {
      return;
    }
    this._template = value;
    if (!this.needsInitialization) {
      this.renderTemplate(value);
    }
  }
  /**
   * Gets/sets the primary styles used for the component.
   * @remarks
   * This value can only be accurately read after connect but can be set at any time.
   */
  get styles() {
    return this._styles;
  }
  set styles(value) {
    if (this._styles === value) {
      return;
    }
    if (this._styles !== null) {
      this.removeStyles(this._styles);
    }
    this._styles = value;
    if (!this.needsInitialization && value !== null) {
      this.addStyles(value);
    }
  }
  /**
   * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
   * @param styles - The styles to add.
   */
  addStyles(styles) {
    const target2 = getShadowRoot(this.element) || this.element.getRootNode();
    if (styles instanceof HTMLStyleElement) {
      target2.append(styles);
    } else if (!styles.isAttachedTo(target2)) {
      const sourceBehaviors = styles.behaviors;
      styles.addStylesTo(target2);
      if (sourceBehaviors !== null) {
        this.addBehaviors(sourceBehaviors);
      }
    }
  }
  /**
   * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
   * @param styles - the styles to remove.
   */
  removeStyles(styles) {
    const target2 = getShadowRoot(this.element) || this.element.getRootNode();
    if (styles instanceof HTMLStyleElement) {
      target2.removeChild(styles);
    } else if (styles.isAttachedTo(target2)) {
      const sourceBehaviors = styles.behaviors;
      styles.removeStylesFrom(target2);
      if (sourceBehaviors !== null) {
        this.removeBehaviors(sourceBehaviors);
      }
    }
  }
  /**
   * Adds behaviors to this element.
   * @param behaviors - The behaviors to add.
   */
  addBehaviors(behaviors) {
    const targetBehaviors = this.behaviors || (this.behaviors = /* @__PURE__ */ new Map());
    const length = behaviors.length;
    const behaviorsToBind = [];
    for (let i = 0; i < length; ++i) {
      const behavior = behaviors[i];
      if (targetBehaviors.has(behavior)) {
        targetBehaviors.set(behavior, targetBehaviors.get(behavior) + 1);
      } else {
        targetBehaviors.set(behavior, 1);
        behaviorsToBind.push(behavior);
      }
    }
    if (this._isConnected) {
      const element = this.element;
      for (let i = 0; i < behaviorsToBind.length; ++i) {
        behaviorsToBind[i].bind(element, defaultExecutionContext);
      }
    }
  }
  /**
   * Removes behaviors from this element.
   * @param behaviors - The behaviors to remove.
   * @param force - Forces unbinding of behaviors.
   */
  removeBehaviors(behaviors, force = false) {
    const targetBehaviors = this.behaviors;
    if (targetBehaviors === null) {
      return;
    }
    const length = behaviors.length;
    const behaviorsToUnbind = [];
    for (let i = 0; i < length; ++i) {
      const behavior = behaviors[i];
      if (targetBehaviors.has(behavior)) {
        const count = targetBehaviors.get(behavior) - 1;
        count === 0 || force ? targetBehaviors.delete(behavior) && behaviorsToUnbind.push(behavior) : targetBehaviors.set(behavior, count);
      }
    }
    if (this._isConnected) {
      const element = this.element;
      for (let i = 0; i < behaviorsToUnbind.length; ++i) {
        behaviorsToUnbind[i].unbind(element);
      }
    }
  }
  /**
   * Runs connected lifecycle behavior on the associated element.
   */
  onConnectedCallback() {
    if (this._isConnected) {
      return;
    }
    const element = this.element;
    if (this.needsInitialization) {
      this.finishInitialization();
    } else if (this.view !== null) {
      this.view.bind(element, defaultExecutionContext);
    }
    const behaviors = this.behaviors;
    if (behaviors !== null) {
      for (const [behavior] of behaviors) {
        behavior.bind(element, defaultExecutionContext);
      }
    }
    this.setIsConnected(true);
  }
  /**
   * Runs disconnected lifecycle behavior on the associated element.
   */
  onDisconnectedCallback() {
    if (!this._isConnected) {
      return;
    }
    this.setIsConnected(false);
    const view = this.view;
    if (view !== null) {
      view.unbind();
    }
    const behaviors = this.behaviors;
    if (behaviors !== null) {
      const element = this.element;
      for (const [behavior] of behaviors) {
        behavior.unbind(element);
      }
    }
  }
  /**
   * Runs the attribute changed callback for the associated element.
   * @param name - The name of the attribute that changed.
   * @param oldValue - The previous value of the attribute.
   * @param newValue - The new value of the attribute.
   */
  onAttributeChangedCallback(name, oldValue, newValue) {
    const attrDef = this.definition.attributeLookup[name];
    if (attrDef !== void 0) {
      attrDef.onAttributeChangedCallback(this.element, newValue);
    }
  }
  /**
   * Emits a custom HTML event.
   * @param type - The type name of the event.
   * @param detail - The event detail object to send with the event.
   * @param options - The event options. By default bubbles and composed.
   * @remarks
   * Only emits events if connected.
   */
  emit(type, detail, options) {
    if (this._isConnected) {
      return this.element.dispatchEvent(new CustomEvent(type, Object.assign(Object.assign({ detail }, defaultEventOptions), options)));
    }
    return false;
  }
  finishInitialization() {
    const element = this.element;
    const boundObservables = this.boundObservables;
    if (boundObservables !== null) {
      const propertyNames = Object.keys(boundObservables);
      for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
        const propertyName = propertyNames[i];
        element[propertyName] = boundObservables[propertyName];
      }
      this.boundObservables = null;
    }
    const definition = this.definition;
    if (this._template === null) {
      if (this.element.resolveTemplate) {
        this._template = this.element.resolveTemplate();
      } else if (definition.template) {
        this._template = definition.template || null;
      }
    }
    if (this._template !== null) {
      this.renderTemplate(this._template);
    }
    if (this._styles === null) {
      if (this.element.resolveStyles) {
        this._styles = this.element.resolveStyles();
      } else if (definition.styles) {
        this._styles = definition.styles || null;
      }
    }
    if (this._styles !== null) {
      this.addStyles(this._styles);
    }
    this.needsInitialization = false;
  }
  renderTemplate(template) {
    const element = this.element;
    const host = getShadowRoot(element) || element;
    if (this.view !== null) {
      this.view.dispose();
      this.view = null;
    } else if (!this.needsInitialization) {
      DOM.removeChildNodes(host);
    }
    if (template) {
      this.view = template.render(element, host, element);
    }
  }
  /**
   * Locates or creates a controller for the specified element.
   * @param element - The element to return the controller for.
   * @remarks
   * The specified element must have a {@link FASTElementDefinition}
   * registered either through the use of the {@link customElement}
   * decorator or a call to `FASTElement.define`.
   */
  static forCustomElement(element) {
    const controller = element.$fastController;
    if (controller !== void 0) {
      return controller;
    }
    const definition = FASTElementDefinition.forType(element.constructor);
    if (definition === void 0) {
      throw new Error("Missing FASTElement definition.");
    }
    return element.$fastController = new _Controller(element, definition);
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/components/fast-element.js
function createFASTElement(BaseType) {
  return class extends BaseType {
    constructor() {
      super();
      Controller.forCustomElement(this);
    }
    $emit(type, detail, options) {
      return this.$fastController.emit(type, detail, options);
    }
    connectedCallback() {
      this.$fastController.onConnectedCallback();
    }
    disconnectedCallback() {
      this.$fastController.onDisconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
    }
  };
}
var FASTElement = Object.assign(createFASTElement(HTMLElement), {
  /**
   * Creates a new FASTElement base class inherited from the
   * provided base type.
   * @param BaseType - The base element type to inherit from.
   */
  from(BaseType) {
    return createFASTElement(BaseType);
  },
  /**
   * Defines a platform custom element based on the provided type and definition.
   * @param type - The custom element type to define.
   * @param nameOrDef - The name of the element to define or a definition object
   * that describes the element to define.
   */
  define(type, nameOrDef) {
    return new FASTElementDefinition(type, nameOrDef).define().type;
  }
});

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/styles/css-directive.js
var CSSDirective = class {
  /**
   * Creates a CSS fragment to interpolate into the CSS document.
   * @returns - the string to interpolate into CSS
   */
  createCSS() {
    return "";
  }
  /**
   * Creates a behavior to bind to the host element.
   * @returns - the behavior to bind to the host element, or undefined.
   */
  createBehavior() {
    return void 0;
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/styles/css.js
function collectStyles(strings, values) {
  const styles = [];
  let cssString = "";
  const behaviors = [];
  for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
    cssString += strings[i];
    let value = values[i];
    if (value instanceof CSSDirective) {
      const behavior = value.createBehavior();
      value = value.createCSS();
      if (behavior) {
        behaviors.push(behavior);
      }
    }
    if (value instanceof ElementStyles || value instanceof CSSStyleSheet) {
      if (cssString.trim() !== "") {
        styles.push(cssString);
        cssString = "";
      }
      styles.push(value);
    } else {
      cssString += value;
    }
  }
  cssString += strings[strings.length - 1];
  if (cssString.trim() !== "") {
    styles.push(cssString);
  }
  return {
    styles,
    behaviors
  };
}
function css2(strings, ...values) {
  const { styles, behaviors } = collectStyles(strings, values);
  const elementStyles = ElementStyles.create(styles);
  if (behaviors.length) {
    elementStyles.withBehaviors(...behaviors);
  }
  return elementStyles;
}
var CSSPartial = class extends CSSDirective {
  constructor(styles, behaviors) {
    super();
    this.behaviors = behaviors;
    this.css = "";
    const stylesheets = styles.reduce((accumulated, current) => {
      if (typeof current === "string") {
        this.css += current;
      } else {
        accumulated.push(current);
      }
      return accumulated;
    }, []);
    if (stylesheets.length) {
      this.styles = ElementStyles.create(stylesheets);
    }
  }
  createBehavior() {
    return this;
  }
  createCSS() {
    return this.css;
  }
  bind(el) {
    if (this.styles) {
      el.$fastController.addStyles(this.styles);
    }
    if (this.behaviors.length) {
      el.$fastController.addBehaviors(this.behaviors);
    }
  }
  unbind(el) {
    if (this.styles) {
      el.$fastController.removeStyles(this.styles);
    }
    if (this.behaviors.length) {
      el.$fastController.removeBehaviors(this.behaviors);
    }
  }
};
function cssPartial(strings, ...values) {
  const { styles, behaviors } = collectStyles(strings, values);
  return new CSSPartial(styles, behaviors);
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/observation/array-change-records.js
function newSplice(index, removed, addedCount) {
  return {
    index,
    removed,
    addedCount
  };
}
var EDIT_LEAVE = 0;
var EDIT_UPDATE = 1;
var EDIT_ADD = 2;
var EDIT_DELETE = 3;
function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
  const rowCount = oldEnd - oldStart + 1;
  const columnCount = currentEnd - currentStart + 1;
  const distances = new Array(rowCount);
  let north;
  let west;
  for (let i = 0; i < rowCount; ++i) {
    distances[i] = new Array(columnCount);
    distances[i][0] = i;
  }
  for (let j = 0; j < columnCount; ++j) {
    distances[0][j] = j;
  }
  for (let i = 1; i < rowCount; ++i) {
    for (let j = 1; j < columnCount; ++j) {
      if (current[currentStart + j - 1] === old[oldStart + i - 1]) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        north = distances[i - 1][j] + 1;
        west = distances[i][j - 1] + 1;
        distances[i][j] = north < west ? north : west;
      }
    }
  }
  return distances;
}
function spliceOperationsFromEditDistances(distances) {
  let i = distances.length - 1;
  let j = distances[0].length - 1;
  let current = distances[i][j];
  const edits = [];
  while (i > 0 || j > 0) {
    if (i === 0) {
      edits.push(EDIT_ADD);
      j--;
      continue;
    }
    if (j === 0) {
      edits.push(EDIT_DELETE);
      i--;
      continue;
    }
    const northWest = distances[i - 1][j - 1];
    const west = distances[i - 1][j];
    const north = distances[i][j - 1];
    let min;
    if (west < north) {
      min = west < northWest ? west : northWest;
    } else {
      min = north < northWest ? north : northWest;
    }
    if (min === northWest) {
      if (northWest === current) {
        edits.push(EDIT_LEAVE);
      } else {
        edits.push(EDIT_UPDATE);
        current = northWest;
      }
      i--;
      j--;
    } else if (min === west) {
      edits.push(EDIT_DELETE);
      i--;
      current = west;
    } else {
      edits.push(EDIT_ADD);
      j--;
      current = north;
    }
  }
  edits.reverse();
  return edits;
}
function sharedPrefix(current, old, searchLength) {
  for (let i = 0; i < searchLength; ++i) {
    if (current[i] !== old[i]) {
      return i;
    }
  }
  return searchLength;
}
function sharedSuffix(current, old, searchLength) {
  let index1 = current.length;
  let index2 = old.length;
  let count = 0;
  while (count < searchLength && current[--index1] === old[--index2]) {
    count++;
  }
  return count;
}
function intersect(start1, end1, start2, end2) {
  if (end1 < start2 || end2 < start1) {
    return -1;
  }
  if (end1 === start2 || end2 === start1) {
    return 0;
  }
  if (start1 < start2) {
    if (end1 < end2) {
      return end1 - start2;
    }
    return end2 - start2;
  }
  if (end2 < end1) {
    return end2 - start1;
  }
  return end1 - start1;
}
function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
  let prefixCount = 0;
  let suffixCount = 0;
  const minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
  if (currentStart === 0 && oldStart === 0) {
    prefixCount = sharedPrefix(current, old, minLength);
  }
  if (currentEnd === current.length && oldEnd === old.length) {
    suffixCount = sharedSuffix(current, old, minLength - prefixCount);
  }
  currentStart += prefixCount;
  oldStart += prefixCount;
  currentEnd -= suffixCount;
  oldEnd -= suffixCount;
  if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
    return emptyArray;
  }
  if (currentStart === currentEnd) {
    const splice2 = newSplice(currentStart, [], 0);
    while (oldStart < oldEnd) {
      splice2.removed.push(old[oldStart++]);
    }
    return [splice2];
  } else if (oldStart === oldEnd) {
    return [newSplice(currentStart, [], currentEnd - currentStart)];
  }
  const ops = spliceOperationsFromEditDistances(calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
  const splices = [];
  let splice = void 0;
  let index = currentStart;
  let oldIndex = oldStart;
  for (let i = 0; i < ops.length; ++i) {
    switch (ops[i]) {
      case EDIT_LEAVE:
        if (splice !== void 0) {
          splices.push(splice);
          splice = void 0;
        }
        index++;
        oldIndex++;
        break;
      case EDIT_UPDATE:
        if (splice === void 0) {
          splice = newSplice(index, [], 0);
        }
        splice.addedCount++;
        index++;
        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
      case EDIT_ADD:
        if (splice === void 0) {
          splice = newSplice(index, [], 0);
        }
        splice.addedCount++;
        index++;
        break;
      case EDIT_DELETE:
        if (splice === void 0) {
          splice = newSplice(index, [], 0);
        }
        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
    }
  }
  if (splice !== void 0) {
    splices.push(splice);
  }
  return splices;
}
var $push = Array.prototype.push;
function mergeSplice(splices, index, removed, addedCount) {
  const splice = newSplice(index, removed, addedCount);
  let inserted = false;
  let insertionOffset = 0;
  for (let i = 0; i < splices.length; i++) {
    const current = splices[i];
    current.index += insertionOffset;
    if (inserted) {
      continue;
    }
    const intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);
    if (intersectCount >= 0) {
      splices.splice(i, 1);
      i--;
      insertionOffset -= current.addedCount - current.removed.length;
      splice.addedCount += current.addedCount - intersectCount;
      const deleteCount = splice.removed.length + current.removed.length - intersectCount;
      if (!splice.addedCount && !deleteCount) {
        inserted = true;
      } else {
        let currentRemoved = current.removed;
        if (splice.index < current.index) {
          const prepend = splice.removed.slice(0, current.index - splice.index);
          $push.apply(prepend, currentRemoved);
          currentRemoved = prepend;
        }
        if (splice.index + splice.removed.length > current.index + current.addedCount) {
          const append = splice.removed.slice(current.index + current.addedCount - splice.index);
          $push.apply(currentRemoved, append);
        }
        splice.removed = currentRemoved;
        if (current.index < splice.index) {
          splice.index = current.index;
        }
      }
    } else if (splice.index < current.index) {
      inserted = true;
      splices.splice(i, 0, splice);
      i++;
      const offset = splice.addedCount - splice.removed.length;
      current.index += offset;
      insertionOffset += offset;
    }
  }
  if (!inserted) {
    splices.push(splice);
  }
}
function createInitialSplices(changeRecords) {
  const splices = [];
  for (let i = 0, ii = changeRecords.length; i < ii; i++) {
    const record = changeRecords[i];
    mergeSplice(splices, record.index, record.removed, record.addedCount);
  }
  return splices;
}
function projectArraySplices(array, changeRecords) {
  let splices = [];
  const initialSplices = createInitialSplices(changeRecords);
  for (let i = 0, ii = initialSplices.length; i < ii; ++i) {
    const splice = initialSplices[i];
    if (splice.addedCount === 1 && splice.removed.length === 1) {
      if (splice.removed[0] !== array[splice.index]) {
        splices.push(splice);
      }
      continue;
    }
    splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
  }
  return splices;
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/observation/array-observer.js
var arrayObservationEnabled = false;
function adjustIndex(changeRecord, array) {
  let index = changeRecord.index;
  const arrayLength = array.length;
  if (index > arrayLength) {
    index = arrayLength - changeRecord.addedCount;
  } else if (index < 0) {
    index = arrayLength + changeRecord.removed.length + index - changeRecord.addedCount;
  }
  if (index < 0) {
    index = 0;
  }
  changeRecord.index = index;
  return changeRecord;
}
var ArrayObserver = class extends SubscriberSet {
  constructor(source) {
    super(source);
    this.oldCollection = void 0;
    this.splices = void 0;
    this.needsQueue = true;
    this.call = this.flush;
    Reflect.defineProperty(source, "$fastController", {
      value: this,
      enumerable: false
    });
  }
  subscribe(subscriber) {
    this.flush();
    super.subscribe(subscriber);
  }
  addSplice(splice) {
    if (this.splices === void 0) {
      this.splices = [splice];
    } else {
      this.splices.push(splice);
    }
    if (this.needsQueue) {
      this.needsQueue = false;
      DOM.queueUpdate(this);
    }
  }
  reset(oldCollection) {
    this.oldCollection = oldCollection;
    if (this.needsQueue) {
      this.needsQueue = false;
      DOM.queueUpdate(this);
    }
  }
  flush() {
    const splices = this.splices;
    const oldCollection = this.oldCollection;
    if (splices === void 0 && oldCollection === void 0) {
      return;
    }
    this.needsQueue = true;
    this.splices = void 0;
    this.oldCollection = void 0;
    const finalSplices = oldCollection === void 0 ? projectArraySplices(this.source, splices) : calcSplices(this.source, 0, this.source.length, oldCollection, 0, oldCollection.length);
    this.notify(finalSplices);
  }
};
function enableArrayObservation() {
  if (arrayObservationEnabled) {
    return;
  }
  arrayObservationEnabled = true;
  Observable.setArrayObserverFactory((collection) => {
    return new ArrayObserver(collection);
  });
  const proto = Array.prototype;
  if (proto.$fastPatch) {
    return;
  }
  Reflect.defineProperty(proto, "$fastPatch", {
    value: 1,
    enumerable: false
  });
  const pop = proto.pop;
  const push = proto.push;
  const reverse = proto.reverse;
  const shift = proto.shift;
  const sort = proto.sort;
  const splice = proto.splice;
  const unshift = proto.unshift;
  proto.pop = function() {
    const notEmpty = this.length > 0;
    const methodCallResult = pop.apply(this, arguments);
    const o = this.$fastController;
    if (o !== void 0 && notEmpty) {
      o.addSplice(newSplice(this.length, [methodCallResult], 0));
    }
    return methodCallResult;
  };
  proto.push = function() {
    const methodCallResult = push.apply(this, arguments);
    const o = this.$fastController;
    if (o !== void 0) {
      o.addSplice(adjustIndex(newSplice(this.length - arguments.length, [], arguments.length), this));
    }
    return methodCallResult;
  };
  proto.reverse = function() {
    let oldArray;
    const o = this.$fastController;
    if (o !== void 0) {
      o.flush();
      oldArray = this.slice();
    }
    const methodCallResult = reverse.apply(this, arguments);
    if (o !== void 0) {
      o.reset(oldArray);
    }
    return methodCallResult;
  };
  proto.shift = function() {
    const notEmpty = this.length > 0;
    const methodCallResult = shift.apply(this, arguments);
    const o = this.$fastController;
    if (o !== void 0 && notEmpty) {
      o.addSplice(newSplice(0, [methodCallResult], 0));
    }
    return methodCallResult;
  };
  proto.sort = function() {
    let oldArray;
    const o = this.$fastController;
    if (o !== void 0) {
      o.flush();
      oldArray = this.slice();
    }
    const methodCallResult = sort.apply(this, arguments);
    if (o !== void 0) {
      o.reset(oldArray);
    }
    return methodCallResult;
  };
  proto.splice = function() {
    const methodCallResult = splice.apply(this, arguments);
    const o = this.$fastController;
    if (o !== void 0) {
      o.addSplice(adjustIndex(newSplice(+arguments[0], methodCallResult, arguments.length > 2 ? arguments.length - 2 : 0), this));
    }
    return methodCallResult;
  };
  proto.unshift = function() {
    const methodCallResult = unshift.apply(this, arguments);
    const o = this.$fastController;
    if (o !== void 0) {
      o.addSplice(adjustIndex(newSplice(0, [], arguments.length), this));
    }
    return methodCallResult;
  };
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/ref.js
var RefBehavior = class {
  /**
   * Creates an instance of RefBehavior.
   * @param target - The element to reference.
   * @param propertyName - The name of the property to assign the reference to.
   */
  constructor(target2, propertyName) {
    this.target = target2;
    this.propertyName = propertyName;
  }
  /**
   * Bind this behavior to the source.
   * @param source - The source to bind to.
   * @param context - The execution context that the binding is operating within.
   */
  bind(source) {
    source[this.propertyName] = this.target;
  }
  /**
   * Unbinds this behavior from the source.
   * @param source - The source to unbind from.
   */
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  unbind() {
  }
};
function ref(propertyName) {
  return new AttachedBehaviorHTMLDirective("fast-ref", RefBehavior, propertyName);
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/interfaces.js
var isFunction = (object) => typeof object === "function";

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/when.js
var noTemplate = () => null;
function normalizeBinding(value) {
  return value === void 0 ? noTemplate : isFunction(value) ? value : () => value;
}
function when(binding, templateOrTemplateBinding, elseTemplateOrTemplateBinding) {
  const dataBinding = isFunction(binding) ? binding : () => binding;
  const templateBinding = normalizeBinding(templateOrTemplateBinding);
  const elseBinding = normalizeBinding(elseTemplateOrTemplateBinding);
  return (source, context) => dataBinding(source, context) ? templateBinding(source, context) : elseBinding(source, context);
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/repeat.js
var defaultRepeatOptions = Object.freeze({
  positioning: false,
  recycle: true
});
function bindWithoutPositioning(view, items, index, context) {
  view.bind(items[index], context);
}
function bindWithPositioning(view, items, index, context) {
  const childContext = Object.create(context);
  childContext.index = index;
  childContext.length = items.length;
  view.bind(items[index], childContext);
}
var RepeatBehavior = class {
  /**
   * Creates an instance of RepeatBehavior.
   * @param location - The location in the DOM to render the repeat.
   * @param itemsBinding - The array to render.
   * @param isItemsBindingVolatile - Indicates whether the items binding has volatile dependencies.
   * @param templateBinding - The template to render for each item.
   * @param isTemplateBindingVolatile - Indicates whether the template binding has volatile dependencies.
   * @param options - Options used to turn on special repeat features.
   */
  constructor(location, itemsBinding, isItemsBindingVolatile, templateBinding, isTemplateBindingVolatile, options) {
    this.location = location;
    this.itemsBinding = itemsBinding;
    this.templateBinding = templateBinding;
    this.options = options;
    this.source = null;
    this.views = [];
    this.items = null;
    this.itemsObserver = null;
    this.originalContext = void 0;
    this.childContext = void 0;
    this.bindView = bindWithoutPositioning;
    this.itemsBindingObserver = Observable.binding(itemsBinding, this, isItemsBindingVolatile);
    this.templateBindingObserver = Observable.binding(templateBinding, this, isTemplateBindingVolatile);
    if (options.positioning) {
      this.bindView = bindWithPositioning;
    }
  }
  /**
   * Bind this behavior to the source.
   * @param source - The source to bind to.
   * @param context - The execution context that the binding is operating within.
   */
  bind(source, context) {
    this.source = source;
    this.originalContext = context;
    this.childContext = Object.create(context);
    this.childContext.parent = source;
    this.childContext.parentContext = this.originalContext;
    this.items = this.itemsBindingObserver.observe(source, this.originalContext);
    this.template = this.templateBindingObserver.observe(source, this.originalContext);
    this.observeItems(true);
    this.refreshAllViews();
  }
  /**
   * Unbinds this behavior from the source.
   * @param source - The source to unbind from.
   */
  unbind() {
    this.source = null;
    this.items = null;
    if (this.itemsObserver !== null) {
      this.itemsObserver.unsubscribe(this);
    }
    this.unbindAllViews();
    this.itemsBindingObserver.disconnect();
    this.templateBindingObserver.disconnect();
  }
  /** @internal */
  handleChange(source, args) {
    if (source === this.itemsBinding) {
      this.items = this.itemsBindingObserver.observe(this.source, this.originalContext);
      this.observeItems();
      this.refreshAllViews();
    } else if (source === this.templateBinding) {
      this.template = this.templateBindingObserver.observe(this.source, this.originalContext);
      this.refreshAllViews(true);
    } else {
      this.updateViews(args);
    }
  }
  observeItems(force = false) {
    if (!this.items) {
      this.items = emptyArray;
      return;
    }
    const oldObserver = this.itemsObserver;
    const newObserver = this.itemsObserver = Observable.getNotifier(this.items);
    const hasNewObserver = oldObserver !== newObserver;
    if (hasNewObserver && oldObserver !== null) {
      oldObserver.unsubscribe(this);
    }
    if (hasNewObserver || force) {
      newObserver.subscribe(this);
    }
  }
  updateViews(splices) {
    const childContext = this.childContext;
    const views = this.views;
    const bindView = this.bindView;
    const items = this.items;
    const template = this.template;
    const recycle = this.options.recycle;
    const leftoverViews = [];
    let leftoverIndex = 0;
    let availableViews = 0;
    for (let i = 0, ii = splices.length; i < ii; ++i) {
      const splice = splices[i];
      const removed = splice.removed;
      let removeIndex = 0;
      let addIndex = splice.index;
      const end = addIndex + splice.addedCount;
      const removedViews = views.splice(splice.index, removed.length);
      const totalAvailableViews = availableViews = leftoverViews.length + removedViews.length;
      for (; addIndex < end; ++addIndex) {
        const neighbor = views[addIndex];
        const location = neighbor ? neighbor.firstChild : this.location;
        let view;
        if (recycle && availableViews > 0) {
          if (removeIndex <= totalAvailableViews && removedViews.length > 0) {
            view = removedViews[removeIndex];
            removeIndex++;
          } else {
            view = leftoverViews[leftoverIndex];
            leftoverIndex++;
          }
          availableViews--;
        } else {
          view = template.create();
        }
        views.splice(addIndex, 0, view);
        bindView(view, items, addIndex, childContext);
        view.insertBefore(location);
      }
      if (removedViews[removeIndex]) {
        leftoverViews.push(...removedViews.slice(removeIndex));
      }
    }
    for (let i = leftoverIndex, ii = leftoverViews.length; i < ii; ++i) {
      leftoverViews[i].dispose();
    }
    if (this.options.positioning) {
      for (let i = 0, ii = views.length; i < ii; ++i) {
        const currentContext = views[i].context;
        currentContext.length = ii;
        currentContext.index = i;
      }
    }
  }
  refreshAllViews(templateChanged = false) {
    const items = this.items;
    const childContext = this.childContext;
    const template = this.template;
    const location = this.location;
    const bindView = this.bindView;
    let itemsLength = items.length;
    let views = this.views;
    let viewsLength = views.length;
    if (itemsLength === 0 || templateChanged || !this.options.recycle) {
      HTMLView.disposeContiguousBatch(views);
      viewsLength = 0;
    }
    if (viewsLength === 0) {
      this.views = views = new Array(itemsLength);
      for (let i = 0; i < itemsLength; ++i) {
        const view = template.create();
        bindView(view, items, i, childContext);
        views[i] = view;
        view.insertBefore(location);
      }
    } else {
      let i = 0;
      for (; i < itemsLength; ++i) {
        if (i < viewsLength) {
          const view = views[i];
          bindView(view, items, i, childContext);
        } else {
          const view = template.create();
          bindView(view, items, i, childContext);
          views.push(view);
          view.insertBefore(location);
        }
      }
      const removed = views.splice(i, viewsLength - i);
      for (i = 0, itemsLength = removed.length; i < itemsLength; ++i) {
        removed[i].dispose();
      }
    }
  }
  unbindAllViews() {
    const views = this.views;
    for (let i = 0, ii = views.length; i < ii; ++i) {
      views[i].unbind();
    }
  }
};
var RepeatDirective = class extends HTMLDirective {
  /**
   * Creates an instance of RepeatDirective.
   * @param itemsBinding - The binding that provides the array to render.
   * @param templateBinding - The template binding used to obtain a template to render for each item in the array.
   * @param options - Options used to turn on special repeat features.
   */
  constructor(itemsBinding, templateBinding, options) {
    super();
    this.itemsBinding = itemsBinding;
    this.templateBinding = templateBinding;
    this.options = options;
    this.createPlaceholder = DOM.createBlockPlaceholder;
    enableArrayObservation();
    this.isItemsBindingVolatile = Observable.isVolatileBinding(itemsBinding);
    this.isTemplateBindingVolatile = Observable.isVolatileBinding(templateBinding);
  }
  /**
   * Creates a behavior for the provided target node.
   * @param target - The node instance to create the behavior for.
   */
  createBehavior(target2) {
    return new RepeatBehavior(target2, this.itemsBinding, this.isItemsBindingVolatile, this.templateBinding, this.isTemplateBindingVolatile, this.options);
  }
};
function repeat(itemsBinding, templateOrTemplateBinding, options = defaultRepeatOptions) {
  const templateBinding = typeof templateOrTemplateBinding === "function" ? templateOrTemplateBinding : () => templateOrTemplateBinding;
  return new RepeatDirective(itemsBinding, templateBinding, Object.assign(Object.assign({}, defaultRepeatOptions), options));
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/node-observation.js
function elements(selector) {
  if (selector) {
    return function(value, index, array) {
      return value.nodeType === 1 && value.matches(selector);
    };
  }
  return function(value, index, array) {
    return value.nodeType === 1;
  };
}
var NodeObservationBehavior = class {
  /**
   * Creates an instance of NodeObservationBehavior.
   * @param target - The target to assign the nodes property on.
   * @param options - The options to use in configuring node observation.
   */
  constructor(target2, options) {
    this.target = target2;
    this.options = options;
    this.source = null;
  }
  /**
   * Bind this behavior to the source.
   * @param source - The source to bind to.
   * @param context - The execution context that the binding is operating within.
   */
  bind(source) {
    const name = this.options.property;
    this.shouldUpdate = Observable.getAccessors(source).some((x) => x.name === name);
    this.source = source;
    this.updateTarget(this.computeNodes());
    if (this.shouldUpdate) {
      this.observe();
    }
  }
  /**
   * Unbinds this behavior from the source.
   * @param source - The source to unbind from.
   */
  unbind() {
    this.updateTarget(emptyArray);
    this.source = null;
    if (this.shouldUpdate) {
      this.disconnect();
    }
  }
  /** @internal */
  handleEvent() {
    this.updateTarget(this.computeNodes());
  }
  computeNodes() {
    let nodes = this.getNodes();
    if (this.options.filter !== void 0) {
      nodes = nodes.filter(this.options.filter);
    }
    return nodes;
  }
  updateTarget(value) {
    this.source[this.options.property] = value;
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/slotted.js
var SlottedBehavior = class extends NodeObservationBehavior {
  /**
   * Creates an instance of SlottedBehavior.
   * @param target - The slot element target to observe.
   * @param options - The options to use when observing the slot.
   */
  constructor(target2, options) {
    super(target2, options);
  }
  /**
   * Begins observation of the nodes.
   */
  observe() {
    this.target.addEventListener("slotchange", this);
  }
  /**
   * Disconnects observation of the nodes.
   */
  disconnect() {
    this.target.removeEventListener("slotchange", this);
  }
  /**
   * Retrieves the nodes that should be assigned to the target.
   */
  getNodes() {
    return this.target.assignedNodes(this.options);
  }
};
function slotted(propertyOrOptions) {
  if (typeof propertyOrOptions === "string") {
    propertyOrOptions = { property: propertyOrOptions };
  }
  return new AttachedBehaviorHTMLDirective("fast-slotted", SlottedBehavior, propertyOrOptions);
}

// ../web-component-sdk/node_modules/@microsoft/fast-element/dist/esm/templating/children.js
var ChildrenBehavior = class extends NodeObservationBehavior {
  /**
   * Creates an instance of ChildrenBehavior.
   * @param target - The element target to observe children on.
   * @param options - The options to use when observing the element children.
   */
  constructor(target2, options) {
    super(target2, options);
    this.observer = null;
    options.childList = true;
  }
  /**
   * Begins observation of the nodes.
   */
  observe() {
    if (this.observer === null) {
      this.observer = new MutationObserver(this.handleEvent.bind(this));
    }
    this.observer.observe(this.target, this.options);
  }
  /**
   * Disconnects observation of the nodes.
   */
  disconnect() {
    this.observer.disconnect();
  }
  /**
   * Retrieves the nodes that should be assigned to the target.
   */
  getNodes() {
    if ("subtree" in this.options) {
      return Array.from(this.target.querySelectorAll(this.options.selector));
    }
    return Array.from(this.target.childNodes);
  }
};
function children(propertyOrOptions) {
  if (typeof propertyOrOptions === "string") {
    propertyOrOptions = {
      property: propertyOrOptions
    };
  }
  return new AttachedBehaviorHTMLDirective("fast-children", ChildrenBehavior, propertyOrOptions);
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/patterns/start-end.js
var StartEnd = class {
  handleStartContentChange() {
    this.startContainer.classList.toggle("start", this.start.assignedNodes().length > 0);
  }
  handleEndContentChange() {
    this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0);
  }
};
var endSlotTemplate = (context, definition) => html2`
    <span
        part="end"
        ${ref("endContainer")}
        class=${(x) => definition.end ? "end" : void 0}
    >
        <slot name="end" ${ref("end")} @slotchange="${(x) => x.handleEndContentChange()}">
            ${definition.end || ""}
        </slot>
    </span>
`;
var startSlotTemplate = (context, definition) => html2`
    <span
        part="start"
        ${ref("startContainer")}
        class="${(x) => definition.start ? "start" : void 0}"
    >
        <slot
            name="start"
            ${ref("start")}
            @slotchange="${(x) => x.handleStartContentChange()}"
        >
            ${definition.start || ""}
        </slot>
    </span>
`;
var endTemplate = html2`
    <span part="end" ${ref("endContainer")}>
        <slot
            name="end"
            ${ref("end")}
            @slotchange="${(x) => x.handleEndContentChange()}"
        ></slot>
    </span>
`;
var startTemplate = html2`
    <span part="start" ${ref("startContainer")}>
        <slot
            name="start"
            ${ref("start")}
            @slotchange="${(x) => x.handleStartContentChange()}"
        ></slot>
    </span>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/accordion-item/accordion-item.template.js
var accordionItemTemplate = (context, definition) => html2`
    <template class="${(x) => x.expanded ? "expanded" : ""}">
        <div
            class="heading"
            part="heading"
            role="heading"
            aria-level="${(x) => x.headinglevel}"
        >
            <button
                class="button"
                part="button"
                ${ref("expandbutton")}
                aria-expanded="${(x) => x.expanded}"
                aria-controls="${(x) => x.id}-panel"
                id="${(x) => x.id}"
                @click="${(x, c) => x.clickHandler(c.event)}"
            >
                <span class="heading-content" part="heading-content">
                    <slot name="heading"></slot>
                </span>
            </button>
            ${startSlotTemplate(context, definition)}
            ${endSlotTemplate(context, definition)}
            <span class="icon" part="icon" aria-hidden="true">
                <slot name="expanded-icon" part="expanded-icon">
                    ${definition.expandedIcon || ""}
                </slot>
                <slot name="collapsed-icon" part="collapsed-icon">
                    ${definition.collapsedIcon || ""}
                </slot>
            <span>
        </div>
        <div
            class="region"
            part="region"
            id="${(x) => x.id}-panel"
            role="region"
            aria-labelledby="${(x) => x.id}"
        >
            <slot></slot>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/tslib/tslib.es6.js
function __decorate(decorators, target2, key, desc2) {
  var c = arguments.length, r = c < 3 ? target2 : desc2 === null ? desc2 = Object.getOwnPropertyDescriptor(target2, key) : desc2, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target2, key, desc2);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d2 = decorators[i])
        r = (c < 3 ? d2(r) : c > 3 ? d2(target2, key, r) : d2(target2, key)) || r;
  return c > 3 && r && Object.defineProperty(target2, key, r), r;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/di/di.js
var metadataByTarget = /* @__PURE__ */ new Map();
if (!("metadata" in Reflect)) {
  Reflect.metadata = function(key, value) {
    return function(target2) {
      Reflect.defineMetadata(key, value, target2);
    };
  };
  Reflect.defineMetadata = function(key, value, target2) {
    let metadata = metadataByTarget.get(target2);
    if (metadata === void 0) {
      metadataByTarget.set(target2, metadata = /* @__PURE__ */ new Map());
    }
    metadata.set(key, value);
  };
  Reflect.getOwnMetadata = function(key, target2) {
    const metadata = metadataByTarget.get(target2);
    if (metadata !== void 0) {
      return metadata.get(key);
    }
    return void 0;
  };
}
var ResolverBuilder = class {
  /**
   *
   * @param container - The container to create resolvers for.
   * @param key - The key to register resolvers under.
   */
  constructor(container, key) {
    this.container = container;
    this.key = key;
  }
  /**
   * Creates a resolver for an existing object instance.
   * @param value - The instance to resolve.
   * @returns The resolver.
   */
  instance(value) {
    return this.registerResolver(0, value);
  }
  /**
   * Creates a resolver that enforces a singleton lifetime.
   * @param value - The type to create and cache the singleton for.
   * @returns The resolver.
   */
  singleton(value) {
    return this.registerResolver(1, value);
  }
  /**
   * Creates a resolver that creates a new instance for every dependency request.
   * @param value - The type to create instances of.
   * @returns - The resolver.
   */
  transient(value) {
    return this.registerResolver(2, value);
  }
  /**
   * Creates a resolver that invokes a callback function for every dependency resolution
   * request, allowing custom logic to return the dependency.
   * @param value - The callback to call during resolution.
   * @returns The resolver.
   */
  callback(value) {
    return this.registerResolver(3, value);
  }
  /**
   * Creates a resolver that invokes a callback function the first time that a dependency
   * resolution is requested. The returned value is then cached and provided for all
   * subsequent requests.
   * @param value - The callback to call during the first resolution.
   * @returns The resolver.
   */
  cachedCallback(value) {
    return this.registerResolver(3, cacheCallbackResult(value));
  }
  /**
   * Aliases the current key to a different key.
   * @param destinationKey - The key to point the alias to.
   * @returns The resolver.
   */
  aliasTo(destinationKey) {
    return this.registerResolver(5, destinationKey);
  }
  registerResolver(strategy, state) {
    const { container, key } = this;
    this.container = this.key = void 0;
    return container.registerResolver(key, new ResolverImpl(key, strategy, state));
  }
};
function cloneArrayWithPossibleProps(source) {
  const clone = source.slice();
  const keys = Object.keys(source);
  const len = keys.length;
  let key;
  for (let i = 0; i < len; ++i) {
    key = keys[i];
    if (!isArrayIndex(key)) {
      clone[key] = source[key];
    }
  }
  return clone;
}
var DefaultResolver = Object.freeze({
  /**
   * Disables auto-registration and throws for all un-registered dependencies.
   * @param key - The key to create the resolver for.
   */
  none(key) {
    throw Error(`${key.toString()} not registered, did you forget to add @singleton()?`);
  },
  /**
   * Provides default singleton resolution behavior during auto-registration.
   * @param key - The key to create the resolver for.
   * @returns The resolver.
   */
  singleton(key) {
    return new ResolverImpl(key, 1, key);
  },
  /**
   * Provides default transient resolution behavior during auto-registration.
   * @param key - The key to create the resolver for.
   * @returns The resolver.
   */
  transient(key) {
    return new ResolverImpl(key, 2, key);
  }
});
var ContainerConfiguration = Object.freeze({
  /**
   * The default configuration used when creating a DOM-disconnected container.
   * @remarks
   * The default creates a root container, with no parent container. It does not handle
   * owner requests and it uses singleton resolution behavior for auto-registration.
   */
  default: Object.freeze({
    parentLocator: () => null,
    responsibleForOwnerRequests: false,
    defaultResolver: DefaultResolver.singleton
  })
});
var dependencyLookup = /* @__PURE__ */ new Map();
function getParamTypes(key) {
  return (Type) => {
    return Reflect.getOwnMetadata(key, Type);
  };
}
var rootDOMContainer = null;
var DI = Object.freeze({
  /**
   * Creates a new dependency injection container.
   * @param config - The configuration for the container.
   * @returns A newly created dependency injection container.
   */
  createContainer(config) {
    return new ContainerImpl(null, Object.assign({}, ContainerConfiguration.default, config));
  },
  /**
   * Finds the dependency injection container responsible for providing dependencies
   * to the specified node.
   * @param node - The node to find the responsible container for.
   * @returns The container responsible for providing dependencies to the node.
   * @remarks
   * This will be the same as the parent container if the specified node
   * does not itself host a container configured with responsibleForOwnerRequests.
   */
  findResponsibleContainer(node) {
    const owned = node.$$container$$;
    if (owned && owned.responsibleForOwnerRequests) {
      return owned;
    }
    return DI.findParentContainer(node);
  },
  /**
   * Find the dependency injection container up the DOM tree from this node.
   * @param node - The node to find the parent container for.
   * @returns The parent container of this node.
   * @remarks
   * This will be the same as the responsible container if the specified node
   * does not itself host a container configured with responsibleForOwnerRequests.
   */
  findParentContainer(node) {
    const event = new CustomEvent(DILocateParentEventType, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { container: void 0 }
    });
    node.dispatchEvent(event);
    return event.detail.container || DI.getOrCreateDOMContainer();
  },
  /**
   * Returns a dependency injection container if one is explicitly owned by the specified
   * node. If one is not owned, then a new container is created and assigned to the node.
   * @param node - The node to find or create the container for.
   * @param config - The configuration for the container if one needs to be created.
   * @returns The located or created container.
   * @remarks
   * This API does not search for a responsible or parent container. It looks only for a container
   * directly defined on the specified node and creates one at that location if one does not
   * already exist.
   */
  getOrCreateDOMContainer(node, config) {
    if (!node) {
      return rootDOMContainer || (rootDOMContainer = new ContainerImpl(null, Object.assign({}, ContainerConfiguration.default, config, {
        parentLocator: () => null
      })));
    }
    return node.$$container$$ || new ContainerImpl(node, Object.assign({}, ContainerConfiguration.default, config, {
      parentLocator: DI.findParentContainer
    }));
  },
  /**
   * Gets the "design:paramtypes" metadata for the specified type.
   * @param Type - The type to get the metadata for.
   * @returns The metadata array or undefined if no metadata is found.
   */
  getDesignParamtypes: getParamTypes("design:paramtypes"),
  /**
   * Gets the "di:paramtypes" metadata for the specified type.
   * @param Type - The type to get the metadata for.
   * @returns The metadata array or undefined if no metadata is found.
   */
  getAnnotationParamtypes: getParamTypes("di:paramtypes"),
  /**
   *
   * @param Type - Gets the "di:paramtypes" metadata for the specified type. If none is found,
   * an empty metadata array is created and added.
   * @returns The metadata array.
   */
  getOrCreateAnnotationParamTypes(Type) {
    let annotationParamtypes = this.getAnnotationParamtypes(Type);
    if (annotationParamtypes === void 0) {
      Reflect.defineMetadata("di:paramtypes", annotationParamtypes = [], Type);
    }
    return annotationParamtypes;
  },
  /**
   * Gets the dependency keys representing what is needed to instantiate the specified type.
   * @param Type - The type to get the dependencies for.
   * @returns An array of dependency keys.
   */
  getDependencies(Type) {
    let dependencies = dependencyLookup.get(Type);
    if (dependencies === void 0) {
      const inject2 = Type.inject;
      if (inject2 === void 0) {
        const designParamtypes = DI.getDesignParamtypes(Type);
        const annotationParamtypes = DI.getAnnotationParamtypes(Type);
        if (designParamtypes === void 0) {
          if (annotationParamtypes === void 0) {
            const Proto = Object.getPrototypeOf(Type);
            if (typeof Proto === "function" && Proto !== Function.prototype) {
              dependencies = cloneArrayWithPossibleProps(DI.getDependencies(Proto));
            } else {
              dependencies = [];
            }
          } else {
            dependencies = cloneArrayWithPossibleProps(annotationParamtypes);
          }
        } else if (annotationParamtypes === void 0) {
          dependencies = cloneArrayWithPossibleProps(designParamtypes);
        } else {
          dependencies = cloneArrayWithPossibleProps(designParamtypes);
          let len = annotationParamtypes.length;
          let auAnnotationParamtype;
          for (let i = 0; i < len; ++i) {
            auAnnotationParamtype = annotationParamtypes[i];
            if (auAnnotationParamtype !== void 0) {
              dependencies[i] = auAnnotationParamtype;
            }
          }
          const keys = Object.keys(annotationParamtypes);
          len = keys.length;
          let key;
          for (let i = 0; i < len; ++i) {
            key = keys[i];
            if (!isArrayIndex(key)) {
              dependencies[key] = annotationParamtypes[key];
            }
          }
        }
      } else {
        dependencies = cloneArrayWithPossibleProps(inject2);
      }
      dependencyLookup.set(Type, dependencies);
    }
    return dependencies;
  },
  /**
   * Defines a property on a web component class. The value of this property will
   * be resolved from the dependency injection container responsible for the element
   * instance, based on where it is connected in the DOM.
   * @param target - The target to define the property on.
   * @param propertyName - The name of the property to define.
   * @param key - The dependency injection key.
   * @param respectConnection - Indicates whether or not to update the property value if the
   * hosting component is disconnected and then re-connected at a different location in the DOM.
   * @remarks
   * The respectConnection option is only applicable to elements that descend from FASTElement.
   */
  defineProperty(target2, propertyName, key, respectConnection = false) {
    const diPropertyKey = `$di_${propertyName}`;
    Reflect.defineProperty(target2, propertyName, {
      get: function() {
        let value = this[diPropertyKey];
        if (value === void 0) {
          const container = this instanceof HTMLElement ? DI.findResponsibleContainer(this) : DI.getOrCreateDOMContainer();
          value = container.get(key);
          this[diPropertyKey] = value;
          if (respectConnection && this instanceof FASTElement) {
            const notifier = this.$fastController;
            const handleChange = () => {
              const newContainer = DI.findResponsibleContainer(this);
              const newValue = newContainer.get(key);
              const oldValue = this[diPropertyKey];
              if (newValue !== oldValue) {
                this[diPropertyKey] = value;
                notifier.notify(propertyName);
              }
            };
            notifier.subscribe({ handleChange }, "isConnected");
          }
        }
        return value;
      }
    });
  },
  /**
   * Creates a dependency injection key.
   * @param nameConfigOrCallback - A friendly name for the key or a lambda that configures a
   * default resolution for the dependency.
   * @param configuror - If a friendly name was provided for the first parameter, then an optional
   * lambda that configures a default resolution for the dependency can be provided second.
   * @returns The created key.
   * @remarks
   * The created key can be used as a property decorator or constructor parameter decorator,
   * in addition to its standard use in an inject array or through direct container APIs.
   */
  createInterface(nameConfigOrCallback, configuror) {
    const configure = typeof nameConfigOrCallback === "function" ? nameConfigOrCallback : configuror;
    const friendlyName = typeof nameConfigOrCallback === "string" ? nameConfigOrCallback : nameConfigOrCallback && "friendlyName" in nameConfigOrCallback ? nameConfigOrCallback.friendlyName || defaultFriendlyName : defaultFriendlyName;
    const respectConnection = typeof nameConfigOrCallback === "string" ? false : nameConfigOrCallback && "respectConnection" in nameConfigOrCallback ? nameConfigOrCallback.respectConnection || false : false;
    const Interface = function(target2, property2, index) {
      if (target2 == null || new.target !== void 0) {
        throw new Error(`No registration for interface: '${Interface.friendlyName}'`);
      }
      if (property2) {
        DI.defineProperty(target2, property2, Interface, respectConnection);
      } else {
        const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target2);
        annotationParamtypes[index] = Interface;
      }
    };
    Interface.$isInterface = true;
    Interface.friendlyName = friendlyName == null ? "(anonymous)" : friendlyName;
    if (configure != null) {
      Interface.register = function(container, key) {
        return configure(new ResolverBuilder(container, key !== null && key !== void 0 ? key : Interface));
      };
    }
    Interface.toString = function toString() {
      return `InterfaceSymbol<${Interface.friendlyName}>`;
    };
    return Interface;
  },
  /**
   * A decorator that specifies what to inject into its target.
   * @param dependencies - The dependencies to inject.
   * @returns The decorator to be applied to the target class.
   * @remarks
   * The decorator can be used to decorate a class, listing all of the classes dependencies.
   * Or it can be used to decorate a constructor paramter, indicating what to inject for that
   * parameter.
   * Or it can be used for a web component property, indicating what that property should resolve to.
   */
  inject(...dependencies) {
    return function(target2, key, descriptor) {
      if (typeof descriptor === "number") {
        const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target2);
        const dep = dependencies[0];
        if (dep !== void 0) {
          annotationParamtypes[descriptor] = dep;
        }
      } else if (key) {
        DI.defineProperty(target2, key, dependencies[0]);
      } else {
        const annotationParamtypes = descriptor ? DI.getOrCreateAnnotationParamTypes(descriptor.value) : DI.getOrCreateAnnotationParamTypes(target2);
        let dep;
        for (let i = 0; i < dependencies.length; ++i) {
          dep = dependencies[i];
          if (dep !== void 0) {
            annotationParamtypes[i] = dep;
          }
        }
      }
    };
  },
  /**
   * Registers the `target` class as a transient dependency; each time the dependency is resolved
   * a new instance will be created.
   *
   * @param target - The class / constructor function to register as transient.
   * @returns The same class, with a static `register` method that takes a container and returns the appropriate resolver.
   *
   * @example
   * On an existing class
   * ```ts
   * class Foo { }
   * DI.transient(Foo);
   * ```
   *
   * @example
   * Inline declaration
   *
   * ```ts
   * const Foo = DI.transient(class { });
   * // Foo is now strongly typed with register
   * Foo.register(container);
   * ```
   *
   * @public
   */
  transient(target2) {
    target2.register = function register(container) {
      const registration = Registration.transient(target2, target2);
      return registration.register(container);
    };
    target2.registerInRequestor = false;
    return target2;
  },
  /**
   * Registers the `target` class as a singleton dependency; the class will only be created once. Each
   * consecutive time the dependency is resolved, the same instance will be returned.
   *
   * @param target - The class / constructor function to register as a singleton.
   * @returns The same class, with a static `register` method that takes a container and returns the appropriate resolver.
   * @example
   * On an existing class
   * ```ts
   * class Foo { }
   * DI.singleton(Foo);
   * ```
   *
   * @example
   * Inline declaration
   * ```ts
   * const Foo = DI.singleton(class { });
   * // Foo is now strongly typed with register
   * Foo.register(container);
   * ```
   *
   * @public
   */
  singleton(target2, options = defaultSingletonOptions) {
    target2.register = function register(container) {
      const registration = Registration.singleton(target2, target2);
      return registration.register(container);
    };
    target2.registerInRequestor = options.scoped;
    return target2;
  }
});
var Container = DI.createInterface("Container");
function createResolver(getter) {
  return function(key) {
    const resolver = function(target2, property2, descriptor) {
      DI.inject(resolver)(target2, property2, descriptor);
    };
    resolver.$isResolver = true;
    resolver.resolve = function(handler, requestor) {
      return getter(key, handler, requestor);
    };
    return resolver;
  };
}
var inject = DI.inject;
var defaultSingletonOptions = { scoped: false };
function createAllResolver(getter) {
  return function(key, searchAncestors) {
    searchAncestors = !!searchAncestors;
    const resolver = function(target2, property2, descriptor) {
      DI.inject(resolver)(target2, property2, descriptor);
    };
    resolver.$isResolver = true;
    resolver.resolve = function(handler, requestor) {
      return getter(key, handler, requestor, searchAncestors);
    };
    return resolver;
  };
}
var all = createAllResolver((key, handler, requestor, searchAncestors) => requestor.getAll(key, searchAncestors));
var lazy = createResolver((key, handler, requestor) => {
  return () => requestor.get(key);
});
var optional = createResolver((key, handler, requestor) => {
  if (requestor.has(key, true)) {
    return requestor.get(key);
  } else {
    return void 0;
  }
});
function ignore(target2, property2, descriptor) {
  DI.inject(ignore)(target2, property2, descriptor);
}
ignore.$isResolver = true;
ignore.resolve = () => void 0;
var newInstanceForScope = createResolver((key, handler, requestor) => {
  const instance = createNewInstance(key, handler);
  const resolver = new ResolverImpl(key, 0, instance);
  requestor.registerResolver(key, resolver);
  return instance;
});
var newInstanceOf = createResolver((key, handler, _requestor) => createNewInstance(key, handler));
function createNewInstance(key, handler) {
  return handler.getFactory(key).construct(handler);
}
var ResolverImpl = class {
  constructor(key, strategy, state) {
    this.key = key;
    this.strategy = strategy;
    this.state = state;
    this.resolving = false;
  }
  get $isResolver() {
    return true;
  }
  register(container) {
    return container.registerResolver(this.key, this);
  }
  resolve(handler, requestor) {
    switch (this.strategy) {
      case 0:
        return this.state;
      case 1: {
        if (this.resolving) {
          throw new Error(`Cyclic dependency found: ${this.state.name}`);
        }
        this.resolving = true;
        this.state = handler.getFactory(this.state).construct(requestor);
        this.strategy = 0;
        this.resolving = false;
        return this.state;
      }
      case 2: {
        const factory = handler.getFactory(this.state);
        if (factory === null) {
          throw new Error(`Resolver for ${String(this.key)} returned a null factory`);
        }
        return factory.construct(requestor);
      }
      case 3:
        return this.state(handler, requestor, this);
      case 4:
        return this.state[0].resolve(handler, requestor);
      case 5:
        return requestor.get(this.state);
      default:
        throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`);
    }
  }
  getFactory(container) {
    var _a, _b, _c;
    switch (this.strategy) {
      case 1:
      case 2:
        return container.getFactory(this.state);
      case 5:
        return (_c = (_b = (_a = container.getResolver(this.state)) === null || _a === void 0 ? void 0 : _a.getFactory) === null || _b === void 0 ? void 0 : _b.call(_a, container)) !== null && _c !== void 0 ? _c : null;
      default:
        return null;
    }
  }
};
function containerGetKey(d2) {
  return this.get(d2);
}
function transformInstance(inst, transform) {
  return transform(inst);
}
var FactoryImpl = class {
  constructor(Type, dependencies) {
    this.Type = Type;
    this.dependencies = dependencies;
    this.transformers = null;
  }
  construct(container, dynamicDependencies) {
    let instance;
    if (dynamicDependencies === void 0) {
      instance = new this.Type(...this.dependencies.map(containerGetKey, container));
    } else {
      instance = new this.Type(...this.dependencies.map(containerGetKey, container), ...dynamicDependencies);
    }
    if (this.transformers == null) {
      return instance;
    }
    return this.transformers.reduce(transformInstance, instance);
  }
  registerTransformer(transformer) {
    (this.transformers || (this.transformers = [])).push(transformer);
  }
};
var containerResolver = {
  $isResolver: true,
  resolve(handler, requestor) {
    return requestor;
  }
};
function isRegistry(obj) {
  return typeof obj.register === "function";
}
function isSelfRegistry(obj) {
  return isRegistry(obj) && typeof obj.registerInRequestor === "boolean";
}
function isRegisterInRequester(obj) {
  return isSelfRegistry(obj) && obj.registerInRequestor;
}
function isClass(obj) {
  return obj.prototype !== void 0;
}
var InstrinsicTypeNames = /* @__PURE__ */ new Set([
  "Array",
  "ArrayBuffer",
  "Boolean",
  "DataView",
  "Date",
  "Error",
  "EvalError",
  "Float32Array",
  "Float64Array",
  "Function",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Map",
  "Number",
  "Object",
  "Promise",
  "RangeError",
  "ReferenceError",
  "RegExp",
  "Set",
  "SharedArrayBuffer",
  "String",
  "SyntaxError",
  "TypeError",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
  "URIError",
  "WeakMap",
  "WeakSet"
]);
var DILocateParentEventType = "__DI_LOCATE_PARENT__";
var factories = /* @__PURE__ */ new Map();
var ContainerImpl = class _ContainerImpl {
  constructor(owner, config) {
    this.owner = owner;
    this.config = config;
    this._parent = void 0;
    this.registerDepth = 0;
    this.context = null;
    if (owner !== null) {
      owner.$$container$$ = this;
    }
    this.resolvers = /* @__PURE__ */ new Map();
    this.resolvers.set(Container, containerResolver);
    if (owner instanceof Node) {
      owner.addEventListener(DILocateParentEventType, (e) => {
        if (e.composedPath()[0] !== this.owner) {
          e.detail.container = this;
          e.stopImmediatePropagation();
        }
      });
    }
  }
  get parent() {
    if (this._parent === void 0) {
      this._parent = this.config.parentLocator(this.owner);
    }
    return this._parent;
  }
  get depth() {
    return this.parent === null ? 0 : this.parent.depth + 1;
  }
  get responsibleForOwnerRequests() {
    return this.config.responsibleForOwnerRequests;
  }
  registerWithContext(context, ...params) {
    this.context = context;
    this.register(...params);
    this.context = null;
    return this;
  }
  register(...params) {
    if (++this.registerDepth === 100) {
      throw new Error("Unable to autoregister dependency");
    }
    let current;
    let keys;
    let value;
    let j;
    let jj;
    const context = this.context;
    for (let i = 0, ii = params.length; i < ii; ++i) {
      current = params[i];
      if (!isObject(current)) {
        continue;
      }
      if (isRegistry(current)) {
        current.register(this, context);
      } else if (isClass(current)) {
        Registration.singleton(current, current).register(this);
      } else {
        keys = Object.keys(current);
        j = 0;
        jj = keys.length;
        for (; j < jj; ++j) {
          value = current[keys[j]];
          if (!isObject(value)) {
            continue;
          }
          if (isRegistry(value)) {
            value.register(this, context);
          } else {
            this.register(value);
          }
        }
      }
    }
    --this.registerDepth;
    return this;
  }
  registerResolver(key, resolver) {
    validateKey(key);
    const resolvers = this.resolvers;
    const result = resolvers.get(key);
    if (result == null) {
      resolvers.set(key, resolver);
    } else if (result instanceof ResolverImpl && result.strategy === 4) {
      result.state.push(resolver);
    } else {
      resolvers.set(key, new ResolverImpl(key, 4, [result, resolver]));
    }
    return resolver;
  }
  registerTransformer(key, transformer) {
    const resolver = this.getResolver(key);
    if (resolver == null) {
      return false;
    }
    if (resolver.getFactory) {
      const factory = resolver.getFactory(this);
      if (factory == null) {
        return false;
      }
      factory.registerTransformer(transformer);
      return true;
    }
    return false;
  }
  getResolver(key, autoRegister = true) {
    validateKey(key);
    if (key.resolve !== void 0) {
      return key;
    }
    let current = this;
    let resolver;
    while (current != null) {
      resolver = current.resolvers.get(key);
      if (resolver == null) {
        if (current.parent == null) {
          const handler = isRegisterInRequester(key) ? this : current;
          return autoRegister ? this.jitRegister(key, handler) : null;
        }
        current = current.parent;
      } else {
        return resolver;
      }
    }
    return null;
  }
  has(key, searchAncestors = false) {
    return this.resolvers.has(key) ? true : searchAncestors && this.parent != null ? this.parent.has(key, true) : false;
  }
  get(key) {
    validateKey(key);
    if (key.$isResolver) {
      return key.resolve(this, this);
    }
    let current = this;
    let resolver;
    while (current != null) {
      resolver = current.resolvers.get(key);
      if (resolver == null) {
        if (current.parent == null) {
          const handler = isRegisterInRequester(key) ? this : current;
          resolver = this.jitRegister(key, handler);
          return resolver.resolve(current, this);
        }
        current = current.parent;
      } else {
        return resolver.resolve(current, this);
      }
    }
    throw new Error(`Unable to resolve key: ${String(key)}`);
  }
  getAll(key, searchAncestors = false) {
    validateKey(key);
    const requestor = this;
    let current = requestor;
    let resolver;
    if (searchAncestors) {
      let resolutions = emptyArray;
      while (current != null) {
        resolver = current.resolvers.get(key);
        if (resolver != null) {
          resolutions = resolutions.concat(
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            buildAllResponse(resolver, current, requestor)
          );
        }
        current = current.parent;
      }
      return resolutions;
    } else {
      while (current != null) {
        resolver = current.resolvers.get(key);
        if (resolver == null) {
          current = current.parent;
          if (current == null) {
            return emptyArray;
          }
        } else {
          return buildAllResponse(resolver, current, requestor);
        }
      }
    }
    return emptyArray;
  }
  getFactory(Type) {
    let factory = factories.get(Type);
    if (factory === void 0) {
      if (isNativeFunction(Type)) {
        throw new Error(`${Type.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);
      }
      factories.set(Type, factory = new FactoryImpl(Type, DI.getDependencies(Type)));
    }
    return factory;
  }
  registerFactory(key, factory) {
    factories.set(key, factory);
  }
  createChild(config) {
    return new _ContainerImpl(null, Object.assign({}, this.config, config, { parentLocator: () => this }));
  }
  jitRegister(keyAsValue, handler) {
    if (typeof keyAsValue !== "function") {
      throw new Error(`Attempted to jitRegister something that is not a constructor: '${keyAsValue}'. Did you forget to register this dependency?`);
    }
    if (InstrinsicTypeNames.has(keyAsValue.name)) {
      throw new Error(`Attempted to jitRegister an intrinsic type: ${keyAsValue.name}. Did you forget to add @inject(Key)`);
    }
    if (isRegistry(keyAsValue)) {
      const registrationResolver = keyAsValue.register(handler);
      if (!(registrationResolver instanceof Object) || registrationResolver.resolve == null) {
        const newResolver = handler.resolvers.get(keyAsValue);
        if (newResolver != void 0) {
          return newResolver;
        }
        throw new Error("A valid resolver was not returned from the static register method");
      }
      return registrationResolver;
    } else if (keyAsValue.$isInterface) {
      throw new Error(`Attempted to jitRegister an interface: ${keyAsValue.friendlyName}`);
    } else {
      const resolver = this.config.defaultResolver(keyAsValue, handler);
      handler.resolvers.set(keyAsValue, resolver);
      return resolver;
    }
  }
};
var cache = /* @__PURE__ */ new WeakMap();
function cacheCallbackResult(fun) {
  return function(handler, requestor, resolver) {
    if (cache.has(resolver)) {
      return cache.get(resolver);
    }
    const t = fun(handler, requestor, resolver);
    cache.set(resolver, t);
    return t;
  };
}
var Registration = Object.freeze({
  /**
   * Allows you to pass an instance.
   * Every time you request this {@link Key} you will get this instance back.
   *
   * @example
   * ```
   * Registration.instance(Foo, new Foo()));
   * ```
   *
   * @param key - The key to register the instance under.
   * @param value - The instance to return when the key is requested.
   */
  instance(key, value) {
    return new ResolverImpl(key, 0, value);
  },
  /**
   * Creates an instance from the class.
   * Every time you request this {@link Key} you will get the same one back.
   *
   * @example
   * ```
   * Registration.singleton(Foo, Foo);
   * ```
   *
   * @param key - The key to register the singleton under.
   * @param value - The class to instantiate as a singleton when first requested.
   */
  singleton(key, value) {
    return new ResolverImpl(key, 1, value);
  },
  /**
   * Creates an instance from a class.
   * Every time you request this {@link Key} you will get a new instance.
   *
   * @example
   * ```
   * Registration.instance(Foo, Foo);
   * ```
   *
   * @param key - The key to register the instance type under.
   * @param value - The class to instantiate each time the key is requested.
   */
  transient(key, value) {
    return new ResolverImpl(key, 2, value);
  },
  /**
   * Delegates to a callback function to provide the dependency.
   * Every time you request this {@link Key} the callback will be invoked to provide
   * the dependency.
   *
   * @example
   * ```
   * Registration.callback(Foo, () => new Foo());
   * Registration.callback(Bar, (c: Container) => new Bar(c.get(Foo)));
   * ```
   *
   * @param key - The key to register the callback for.
   * @param callback - The function that is expected to return the dependency.
   */
  callback(key, callback) {
    return new ResolverImpl(key, 3, callback);
  },
  /**
   * Delegates to a callback function to provide the dependency and then caches the
   * dependency for future requests.
   *
   * @example
   * ```
   * Registration.cachedCallback(Foo, () => new Foo());
   * Registration.cachedCallback(Bar, (c: Container) => new Bar(c.get(Foo)));
   * ```
   *
   * @param key - The key to register the callback for.
   * @param callback - The function that is expected to return the dependency.
   * @remarks
   * If you pass the same Registration to another container, the same cached value will be used.
   * Should all references to the resolver returned be removed, the cache will expire.
   */
  cachedCallback(key, callback) {
    return new ResolverImpl(key, 3, cacheCallbackResult(callback));
  },
  /**
   * Creates an alternate {@link Key} to retrieve an instance by.
   *
   * @example
   * ```
   * Register.singleton(Foo, Foo)
   * Register.aliasTo(Foo, MyFoos);
   *
   * container.getAll(MyFoos) // contains an instance of Foo
   * ```
   *
   * @param originalKey - The original key that has been registered.
   * @param aliasKey - The alias to the original key.
   */
  aliasTo(originalKey, aliasKey) {
    return new ResolverImpl(aliasKey, 5, originalKey);
  }
});
function validateKey(key) {
  if (key === null || key === void 0) {
    throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?");
  }
}
function buildAllResponse(resolver, handler, requestor) {
  if (resolver instanceof ResolverImpl && resolver.strategy === 4) {
    const state = resolver.state;
    let i = state.length;
    const results = new Array(i);
    while (i--) {
      results[i] = state[i].resolve(handler, requestor);
    }
    return results;
  }
  return [resolver.resolve(handler, requestor)];
}
var defaultFriendlyName = "(anonymous)";
function isObject(value) {
  return typeof value === "object" && value !== null || typeof value === "function";
}
var isNativeFunction = /* @__PURE__ */ function() {
  const lookup = /* @__PURE__ */ new WeakMap();
  let isNative = false;
  let sourceText = "";
  let i = 0;
  return function(fn) {
    isNative = lookup.get(fn);
    if (isNative === void 0) {
      sourceText = fn.toString();
      i = sourceText.length;
      isNative = // 29 is the length of 'function () { [native code] }' which is the smallest length of a native function string
      i >= 29 && // 100 seems to be a safe upper bound of the max length of a native function. In Chrome and FF it's 56, in Edge it's 61.
      i <= 100 && // This whole heuristic *could* be tricked by a comment. Do we need to care about that?
      sourceText.charCodeAt(i - 1) === 125 && // }
      // TODO: the spec is a little vague about the precise constraints, so we do need to test this across various browsers to make sure just one whitespace is a safe assumption.
      sourceText.charCodeAt(i - 2) <= 32 && // whitespace
      sourceText.charCodeAt(i - 3) === 93 && // ]
      sourceText.charCodeAt(i - 4) === 101 && // e
      sourceText.charCodeAt(i - 5) === 100 && // d
      sourceText.charCodeAt(i - 6) === 111 && // o
      sourceText.charCodeAt(i - 7) === 99 && // c
      sourceText.charCodeAt(i - 8) === 32 && //
      sourceText.charCodeAt(i - 9) === 101 && // e
      sourceText.charCodeAt(i - 10) === 118 && // v
      sourceText.charCodeAt(i - 11) === 105 && // i
      sourceText.charCodeAt(i - 12) === 116 && // t
      sourceText.charCodeAt(i - 13) === 97 && // a
      sourceText.charCodeAt(i - 14) === 110 && // n
      sourceText.charCodeAt(i - 15) === 88;
      lookup.set(fn, isNative);
    }
    return isNative;
  };
}();
var isNumericLookup = {};
function isArrayIndex(value) {
  switch (typeof value) {
    case "number":
      return value >= 0 && (value | 0) === value;
    case "string": {
      const result = isNumericLookup[value];
      if (result !== void 0) {
        return result;
      }
      const length = value.length;
      if (length === 0) {
        return isNumericLookup[value] = false;
      }
      let ch = 0;
      for (let i = 0; i < length; ++i) {
        ch = value.charCodeAt(i);
        if (i === 0 && ch === 48 && length > 1 || ch < 48 || ch > 57) {
          return isNumericLookup[value] = false;
        }
      }
      return isNumericLookup[value] = true;
    }
    default:
      return false;
  }
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/design-system/component-presentation.js
function presentationKeyFromTag(tagName) {
  return `${tagName.toLowerCase()}:presentation`;
}
var presentationRegistry = /* @__PURE__ */ new Map();
var ComponentPresentation = Object.freeze({
  /**
   * Defines a component presentation for an element.
   * @param tagName - The element name to define the presentation for.
   * @param presentation - The presentation that will be applied to matching elements.
   * @param container - The dependency injection container to register the configuration in.
   * @public
   */
  define(tagName, presentation, container) {
    const key = presentationKeyFromTag(tagName);
    const existing = presentationRegistry.get(key);
    if (existing === void 0) {
      presentationRegistry.set(key, presentation);
    } else {
      presentationRegistry.set(key, false);
    }
    container.register(Registration.instance(key, presentation));
  },
  /**
   * Finds a component presentation for the specified element name,
   * searching the DOM hierarchy starting from the provided element.
   * @param tagName - The name of the element to locate the presentation for.
   * @param element - The element to begin the search from.
   * @returns The component presentation or null if none is found.
   * @public
   */
  forTag(tagName, element) {
    const key = presentationKeyFromTag(tagName);
    const existing = presentationRegistry.get(key);
    if (existing === false) {
      const container = DI.findResponsibleContainer(element);
      return container.get(key);
    }
    return existing || null;
  }
});
var DefaultComponentPresentation = class {
  /**
   * Creates an instance of DefaultComponentPresentation.
   * @param template - The template to apply to the element.
   * @param styles - The styles to apply to the element.
   * @public
   */
  constructor(template, styles) {
    this.template = template || null;
    this.styles = styles === void 0 ? null : Array.isArray(styles) ? ElementStyles.create(styles) : styles instanceof ElementStyles ? styles : ElementStyles.create([styles]);
  }
  /**
   * Applies the presentation details to the specified element.
   * @param element - The element to apply the presentation details to.
   * @public
   */
  applyTo(element) {
    const controller = element.$fastController;
    if (controller.template === null) {
      controller.template = this.template;
    }
    if (controller.styles === null) {
      controller.styles = this.styles;
    }
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/foundation-element/foundation-element.js
var FoundationElement = class _FoundationElement extends FASTElement {
  constructor() {
    super(...arguments);
    this._presentation = void 0;
  }
  /**
   * A property which resolves the ComponentPresentation instance
   * for the current component.
   * @public
   */
  get $presentation() {
    if (this._presentation === void 0) {
      this._presentation = ComponentPresentation.forTag(this.tagName, this);
    }
    return this._presentation;
  }
  templateChanged() {
    if (this.template !== void 0) {
      this.$fastController.template = this.template;
    }
  }
  stylesChanged() {
    if (this.styles !== void 0) {
      this.$fastController.styles = this.styles;
    }
  }
  /**
   * The connected callback for this FASTElement.
   * @remarks
   * This method is invoked by the platform whenever this FoundationElement
   * becomes connected to the document.
   * @public
   */
  connectedCallback() {
    if (this.$presentation !== null) {
      this.$presentation.applyTo(this);
    }
    super.connectedCallback();
  }
  /**
   * Defines an element registry function with a set of element definition defaults.
   * @param elementDefinition - The definition of the element to create the registry
   * function for.
   * @public
   */
  static compose(elementDefinition) {
    return (overrideDefinition = {}) => new FoundationElementRegistry(this === _FoundationElement ? class extends _FoundationElement {
    } : this, elementDefinition, overrideDefinition);
  }
};
__decorate([
  observable
], FoundationElement.prototype, "template", void 0);
__decorate([
  observable
], FoundationElement.prototype, "styles", void 0);
function resolveOption(option, context, definition) {
  if (typeof option === "function") {
    return option(context, definition);
  }
  return option;
}
var FoundationElementRegistry = class {
  constructor(type, elementDefinition, overrideDefinition) {
    this.type = type;
    this.elementDefinition = elementDefinition;
    this.overrideDefinition = overrideDefinition;
    this.definition = Object.assign(Object.assign({}, this.elementDefinition), this.overrideDefinition);
  }
  register(container, context) {
    const definition = this.definition;
    const overrideDefinition = this.overrideDefinition;
    const prefix = definition.prefix || context.elementPrefix;
    const name = `${prefix}-${definition.baseName}`;
    context.tryDefineElement({
      name,
      type: this.type,
      baseClass: this.elementDefinition.baseClass,
      callback: (x) => {
        const presentation = new DefaultComponentPresentation(resolveOption(definition.template, x, definition), resolveOption(definition.styles, x, definition));
        x.definePresentation(presentation);
        let shadowOptions = resolveOption(definition.shadowOptions, x, definition);
        if (x.shadowRootMode) {
          if (shadowOptions) {
            if (!overrideDefinition.shadowOptions) {
              shadowOptions.mode = x.shadowRootMode;
            }
          } else if (shadowOptions !== null) {
            shadowOptions = { mode: x.shadowRootMode };
          }
        }
        x.defineElement({
          elementOptions: resolveOption(definition.elementOptions, x, definition),
          shadowOptions,
          attributes: resolveOption(definition.attributes, x, definition)
        });
      }
    });
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/apply-mixins.js
function applyMixins(derivedCtor, ...baseCtors) {
  const derivedAttributes = AttributeConfiguration.locate(derivedCtor);
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== "constructor") {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
        );
      }
    });
    const baseAttributes = AttributeConfiguration.locate(baseCtor);
    baseAttributes.forEach((x) => derivedAttributes.push(x));
  });
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/accordion-item/accordion-item.js
var AccordionItem = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.headinglevel = 2;
    this.expanded = false;
    this.clickHandler = (e) => {
      this.expanded = !this.expanded;
      this.change();
    };
    this.change = () => {
      this.$emit("change");
    };
  }
};
__decorate([
  attr({
    attribute: "heading-level",
    mode: "fromView",
    converter: nullableNumberConverter
  })
], AccordionItem.prototype, "headinglevel", void 0);
__decorate([
  attr({ mode: "boolean" })
], AccordionItem.prototype, "expanded", void 0);
__decorate([
  attr
], AccordionItem.prototype, "id", void 0);
applyMixins(AccordionItem, StartEnd);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/accordion/accordion.template.js
var accordionTemplate = (context, definition) => (
  /* TODO: deprecate slot name `item` to only support default slot https://github.com/microsoft/fast/issues/5515 */
  html2`
    <template>
        <slot ${slotted({ property: "accordionItems", filter: elements() })}></slot>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`
);

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/aria.js
var Orientation = {
  horizontal: "horizontal",
  vertical: "vertical"
};

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/array.js
function findLastIndex(array, predicate) {
  let k = array.length;
  while (k--) {
    if (predicate(array[k], k, array)) {
      return k;
    }
  }
  return -1;
}

// ../web-component-sdk/node_modules/exenv-es6/dist/can-use-dom.js
function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/dom.js
function isHTMLElement(...args) {
  return args.every((arg) => arg instanceof HTMLElement);
}
function getDisplayedNodes(rootNode, selector) {
  if (!rootNode || !selector || !isHTMLElement(rootNode)) {
    return;
  }
  const nodes = Array.from(rootNode.querySelectorAll(selector));
  return nodes.filter((node) => node.offsetParent !== null);
}
function getNonce() {
  const node = document.querySelector('meta[property="csp-nonce"]');
  if (node) {
    return node.getAttribute("content");
  } else {
    return null;
  }
}
var _canUseFocusVisible;
function canUseFocusVisible() {
  if (typeof _canUseFocusVisible === "boolean") {
    return _canUseFocusVisible;
  }
  if (!canUseDOM()) {
    _canUseFocusVisible = false;
    return _canUseFocusVisible;
  }
  const styleElement = document.createElement("style");
  const styleNonce = getNonce();
  if (styleNonce !== null) {
    styleElement.setAttribute("nonce", styleNonce);
  }
  document.head.appendChild(styleElement);
  try {
    styleElement.sheet.insertRule("foo:focus-visible {color:inherit}", 0);
    _canUseFocusVisible = true;
  } catch (e) {
    _canUseFocusVisible = false;
  } finally {
    document.head.removeChild(styleElement);
  }
  return _canUseFocusVisible;
}

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/events.js
var eventFocus = "focus";
var eventFocusIn = "focusin";
var eventFocusOut = "focusout";
var eventKeyDown = "keydown";
var eventResize = "resize";
var eventScroll = "scroll";

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/key-codes.js
var KeyCodes;
(function(KeyCodes2) {
  KeyCodes2[KeyCodes2["alt"] = 18] = "alt";
  KeyCodes2[KeyCodes2["arrowDown"] = 40] = "arrowDown";
  KeyCodes2[KeyCodes2["arrowLeft"] = 37] = "arrowLeft";
  KeyCodes2[KeyCodes2["arrowRight"] = 39] = "arrowRight";
  KeyCodes2[KeyCodes2["arrowUp"] = 38] = "arrowUp";
  KeyCodes2[KeyCodes2["back"] = 8] = "back";
  KeyCodes2[KeyCodes2["backSlash"] = 220] = "backSlash";
  KeyCodes2[KeyCodes2["break"] = 19] = "break";
  KeyCodes2[KeyCodes2["capsLock"] = 20] = "capsLock";
  KeyCodes2[KeyCodes2["closeBracket"] = 221] = "closeBracket";
  KeyCodes2[KeyCodes2["colon"] = 186] = "colon";
  KeyCodes2[KeyCodes2["colon2"] = 59] = "colon2";
  KeyCodes2[KeyCodes2["comma"] = 188] = "comma";
  KeyCodes2[KeyCodes2["ctrl"] = 17] = "ctrl";
  KeyCodes2[KeyCodes2["delete"] = 46] = "delete";
  KeyCodes2[KeyCodes2["end"] = 35] = "end";
  KeyCodes2[KeyCodes2["enter"] = 13] = "enter";
  KeyCodes2[KeyCodes2["equals"] = 187] = "equals";
  KeyCodes2[KeyCodes2["equals2"] = 61] = "equals2";
  KeyCodes2[KeyCodes2["equals3"] = 107] = "equals3";
  KeyCodes2[KeyCodes2["escape"] = 27] = "escape";
  KeyCodes2[KeyCodes2["forwardSlash"] = 191] = "forwardSlash";
  KeyCodes2[KeyCodes2["function1"] = 112] = "function1";
  KeyCodes2[KeyCodes2["function10"] = 121] = "function10";
  KeyCodes2[KeyCodes2["function11"] = 122] = "function11";
  KeyCodes2[KeyCodes2["function12"] = 123] = "function12";
  KeyCodes2[KeyCodes2["function2"] = 113] = "function2";
  KeyCodes2[KeyCodes2["function3"] = 114] = "function3";
  KeyCodes2[KeyCodes2["function4"] = 115] = "function4";
  KeyCodes2[KeyCodes2["function5"] = 116] = "function5";
  KeyCodes2[KeyCodes2["function6"] = 117] = "function6";
  KeyCodes2[KeyCodes2["function7"] = 118] = "function7";
  KeyCodes2[KeyCodes2["function8"] = 119] = "function8";
  KeyCodes2[KeyCodes2["function9"] = 120] = "function9";
  KeyCodes2[KeyCodes2["home"] = 36] = "home";
  KeyCodes2[KeyCodes2["insert"] = 45] = "insert";
  KeyCodes2[KeyCodes2["menu"] = 93] = "menu";
  KeyCodes2[KeyCodes2["minus"] = 189] = "minus";
  KeyCodes2[KeyCodes2["minus2"] = 109] = "minus2";
  KeyCodes2[KeyCodes2["numLock"] = 144] = "numLock";
  KeyCodes2[KeyCodes2["numPad0"] = 96] = "numPad0";
  KeyCodes2[KeyCodes2["numPad1"] = 97] = "numPad1";
  KeyCodes2[KeyCodes2["numPad2"] = 98] = "numPad2";
  KeyCodes2[KeyCodes2["numPad3"] = 99] = "numPad3";
  KeyCodes2[KeyCodes2["numPad4"] = 100] = "numPad4";
  KeyCodes2[KeyCodes2["numPad5"] = 101] = "numPad5";
  KeyCodes2[KeyCodes2["numPad6"] = 102] = "numPad6";
  KeyCodes2[KeyCodes2["numPad7"] = 103] = "numPad7";
  KeyCodes2[KeyCodes2["numPad8"] = 104] = "numPad8";
  KeyCodes2[KeyCodes2["numPad9"] = 105] = "numPad9";
  KeyCodes2[KeyCodes2["numPadDivide"] = 111] = "numPadDivide";
  KeyCodes2[KeyCodes2["numPadDot"] = 110] = "numPadDot";
  KeyCodes2[KeyCodes2["numPadMinus"] = 109] = "numPadMinus";
  KeyCodes2[KeyCodes2["numPadMultiply"] = 106] = "numPadMultiply";
  KeyCodes2[KeyCodes2["numPadPlus"] = 107] = "numPadPlus";
  KeyCodes2[KeyCodes2["openBracket"] = 219] = "openBracket";
  KeyCodes2[KeyCodes2["pageDown"] = 34] = "pageDown";
  KeyCodes2[KeyCodes2["pageUp"] = 33] = "pageUp";
  KeyCodes2[KeyCodes2["period"] = 190] = "period";
  KeyCodes2[KeyCodes2["print"] = 44] = "print";
  KeyCodes2[KeyCodes2["quote"] = 222] = "quote";
  KeyCodes2[KeyCodes2["scrollLock"] = 145] = "scrollLock";
  KeyCodes2[KeyCodes2["shift"] = 16] = "shift";
  KeyCodes2[KeyCodes2["space"] = 32] = "space";
  KeyCodes2[KeyCodes2["tab"] = 9] = "tab";
  KeyCodes2[KeyCodes2["tilde"] = 192] = "tilde";
  KeyCodes2[KeyCodes2["windowsLeft"] = 91] = "windowsLeft";
  KeyCodes2[KeyCodes2["windowsOpera"] = 219] = "windowsOpera";
  KeyCodes2[KeyCodes2["windowsRight"] = 92] = "windowsRight";
})(KeyCodes || (KeyCodes = {}));
var keyArrowDown = "ArrowDown";
var keyArrowLeft = "ArrowLeft";
var keyArrowRight = "ArrowRight";
var keyArrowUp = "ArrowUp";
var keyEnter = "Enter";
var keyEscape = "Escape";
var keyHome = "Home";
var keyEnd = "End";
var keyFunction2 = "F2";
var keyPageDown = "PageDown";
var keyPageUp = "PageUp";
var keySpace = " ";
var keyTab = "Tab";
var keyBackspace = "Backspace";
var keyDelete = "Delete";
var ArrowKeys = {
  ArrowDown: keyArrowDown,
  ArrowLeft: keyArrowLeft,
  ArrowRight: keyArrowRight,
  ArrowUp: keyArrowUp
};

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/localization.js
var Direction;
(function(Direction2) {
  Direction2["ltr"] = "ltr";
  Direction2["rtl"] = "rtl";
})(Direction || (Direction = {}));

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/numbers.js
function wrapInBounds(min, max, value) {
  if (value < min) {
    return max;
  } else if (value > max) {
    return min;
  }
  return value;
}
function limit(min, max, value) {
  return Math.min(Math.max(value, min), max);
}
function inRange(value, min, max = 0) {
  [min, max] = [min, max].sort((a, b) => a - b);
  return min <= value && value < max;
}

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/strings.js
var uniqueIdCounter = 0;
function uniqueId(prefix = "") {
  return `${prefix}${uniqueIdCounter++}`;
}

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/rtl-scroll-converter.js
var RtlScrollConverter = class _RtlScrollConverter {
  /**
   *  Gets the scrollLeft value of the provided element
   */
  static getScrollLeft(scrolledElement, direction2) {
    if (direction2 === Direction.rtl) {
      return _RtlScrollConverter.getRtlScrollLeftConverter(scrolledElement);
    }
    return scrolledElement.scrollLeft;
  }
  /**
   * Sets the scrollLeft value of the provided element
   */
  static setScrollLeft(scrolledElement, scrollValue, direction2) {
    if (direction2 === Direction.rtl) {
      _RtlScrollConverter.setRtlScrollLeftConverter(scrolledElement, scrollValue);
      return;
    }
    scrolledElement.scrollLeft = scrollValue;
  }
  /**
   * The initial rtl scroll converter getter function, it calls the browser test to set the correct converter
   * functions and then invokes the getter
   */
  static initialGetRtlScrollConverter(scrolledElement) {
    _RtlScrollConverter.initializeRtlScrollConverters();
    return _RtlScrollConverter.getRtlScrollLeftConverter(scrolledElement);
  }
  /**
   * The "direct" rtl get scroll converter does not need to tamper with the scrollLeft
   * values as the browser is already doing the right thing.  Content start = 0 and
   * scrolling left goes negative.
   */
  static directGetRtlScrollConverter(scrolledElement) {
    return scrolledElement.scrollLeft;
  }
  /**
   * The "inverted" get scroll converter is used when the browser reports scroll left
   * as a positive maximum scroll value at content start and then goes to zero as content
   * is scrolled left
   */
  static invertedGetRtlScrollConverter(scrolledElement) {
    return -Math.abs(scrolledElement.scrollLeft);
  }
  /**
   * The "reverse" get scroll converter is used when the browser reports scroll left
   * as 0 at content start and then goes positive as content is scrolled left
   */
  static reverseGetRtlScrollConverter(scrolledElement) {
    return scrolledElement.scrollLeft - (scrolledElement.scrollWidth - scrolledElement.clientWidth);
  }
  /**
   * The initial rtl scroll converter setter function, it calls the browser test to set the correct converter
   * functions and then invokes the setter
   */
  static initialSetRtlScrollConverter(scrolledElement, newScrollValue) {
    _RtlScrollConverter.initializeRtlScrollConverters();
    _RtlScrollConverter.setRtlScrollLeftConverter(scrolledElement, newScrollValue);
  }
  /**
   * The "direct" rtl set scroll converter does not need to tamper with the scrollLeft
   * values as the browser is already doing the right thing.  Content start = 0 and
   * scrolling left goes negative.
   */
  static directSetRtlScrollConverter(scrolledElement, newScrollValue) {
    scrolledElement.scrollLeft = newScrollValue;
  }
  /**
   * The "inverted" set scroll converter is used when the browser reports scroll left
   * as a positive maximum scroll value at content start and then goes to zero as content
   * is scrolled left
   */
  static invertedSetRtlScrollConverter(scrolledElement, newScrollValue) {
    scrolledElement.scrollLeft = Math.abs(newScrollValue);
  }
  /**
   * The "reverse" set scroll converter is used when the browser reports scroll left
   * as 0 at content start and then goes positive as content is scrolled left
   */
  static reverseSetRtlScrollConverter(scrolledElement, newScrollValue) {
    const maxScroll = scrolledElement.scrollWidth - scrolledElement.clientWidth;
    scrolledElement.scrollLeft = maxScroll + newScrollValue;
  }
  /**
   * detects the appropriate rtl scroll converter functions and assigns them
   * should only run once
   */
  static initializeRtlScrollConverters() {
    if (!canUseDOM()) {
      _RtlScrollConverter.applyDirectScrollConverters();
      return;
    }
    const testElement = _RtlScrollConverter.getTestElement();
    document.body.appendChild(testElement);
    _RtlScrollConverter.checkForScrollType(testElement);
    document.body.removeChild(testElement);
  }
  /**
   * checks the provided test element to determine scroll type
   * and apply appropriate converters
   */
  static checkForScrollType(testElement) {
    if (_RtlScrollConverter.isReverse(testElement)) {
      _RtlScrollConverter.applyReverseScrollConverters();
    } else {
      if (_RtlScrollConverter.isDirect(testElement)) {
        _RtlScrollConverter.applyDirectScrollConverters();
      } else {
        _RtlScrollConverter.applyInvertedScrollConverters();
      }
    }
  }
  /**
   * checks test element initial state for rtl "reverse" mode
   */
  static isReverse(testElement) {
    return testElement.scrollLeft > 0;
  }
  /**
   * checks test element for rtl "direct" mode
   */
  static isDirect(testElement) {
    testElement.scrollLeft = -1;
    return testElement.scrollLeft < 0;
  }
  /**
   * apply direct scroll conververters
   */
  static applyDirectScrollConverters() {
    _RtlScrollConverter.setRtlScrollLeftConverter = _RtlScrollConverter.directSetRtlScrollConverter;
    _RtlScrollConverter.getRtlScrollLeftConverter = _RtlScrollConverter.directGetRtlScrollConverter;
  }
  /**
   * apply inverted scroll conververters
   */
  static applyInvertedScrollConverters() {
    _RtlScrollConverter.setRtlScrollLeftConverter = _RtlScrollConverter.invertedSetRtlScrollConverter;
    _RtlScrollConverter.getRtlScrollLeftConverter = _RtlScrollConverter.invertedGetRtlScrollConverter;
  }
  /**
   * apply reverse scroll conververters
   */
  static applyReverseScrollConverters() {
    _RtlScrollConverter.setRtlScrollLeftConverter = _RtlScrollConverter.reverseSetRtlScrollConverter;
    _RtlScrollConverter.getRtlScrollLeftConverter = _RtlScrollConverter.reverseGetRtlScrollConverter;
  }
  /**
   * generate a test element for rtl testing
   */
  static getTestElement() {
    const testElement = document.createElement("div");
    testElement.appendChild(document.createTextNode("ABCD"));
    testElement.dir = "rtl";
    testElement.style.fontSize = "14px";
    testElement.style.width = "4px";
    testElement.style.height = "1px";
    testElement.style.position = "absolute";
    testElement.style.top = "-1000px";
    testElement.style.overflow = "scroll";
    return testElement;
  }
};
RtlScrollConverter.getRtlScrollLeftConverter = RtlScrollConverter.initialGetRtlScrollConverter;
RtlScrollConverter.setRtlScrollLeftConverter = RtlScrollConverter.initialSetRtlScrollConverter;

// ../web-component-sdk/node_modules/@microsoft/fast-web-utilities/dist/system-colors.js
var SystemColors;
(function(SystemColors2) {
  SystemColors2["Canvas"] = "Canvas";
  SystemColors2["CanvasText"] = "CanvasText";
  SystemColors2["LinkText"] = "LinkText";
  SystemColors2["VisitedText"] = "VisitedText";
  SystemColors2["ActiveText"] = "ActiveText";
  SystemColors2["ButtonFace"] = "ButtonFace";
  SystemColors2["ButtonText"] = "ButtonText";
  SystemColors2["Field"] = "Field";
  SystemColors2["FieldText"] = "FieldText";
  SystemColors2["Highlight"] = "Highlight";
  SystemColors2["HighlightText"] = "HighlightText";
  SystemColors2["GrayText"] = "GrayText";
})(SystemColors || (SystemColors = {}));

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/accordion/accordion.js
var AccordionExpandMode = {
  /**
   * Designates only a single {@link @microsoft/fast-foundation#(AccordionItem:class) } can be open a time.
   */
  single: "single",
  /**
   * Designates multiple {@link @microsoft/fast-foundation#(AccordionItem:class) | AccordionItems} can be open simultaneously.
   */
  multi: "multi"
};
var Accordion = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.expandmode = AccordionExpandMode.multi;
    this.activeItemIndex = 0;
    this.change = () => {
      this.$emit("change", this.activeid);
    };
    this.setItems = () => {
      var _a;
      if (this.accordionItems.length === 0) {
        return;
      }
      this.accordionIds = this.getItemIds();
      this.accordionItems.forEach((item, index) => {
        if (item instanceof AccordionItem) {
          item.addEventListener("change", this.activeItemChange);
          if (this.isSingleExpandMode()) {
            this.activeItemIndex !== index ? item.expanded = false : item.expanded = true;
          }
        }
        const itemId = this.accordionIds[index];
        item.setAttribute("id", typeof itemId !== "string" ? `accordion-${index + 1}` : itemId);
        this.activeid = this.accordionIds[this.activeItemIndex];
        item.addEventListener("keydown", this.handleItemKeyDown);
        item.addEventListener("focus", this.handleItemFocus);
      });
      if (this.isSingleExpandMode()) {
        const expandedItem = (_a = this.findExpandedItem()) !== null && _a !== void 0 ? _a : this.accordionItems[0];
        expandedItem.setAttribute("aria-disabled", "true");
      }
    };
    this.removeItemListeners = (oldValue) => {
      oldValue.forEach((item, index) => {
        item.removeEventListener("change", this.activeItemChange);
        item.removeEventListener("keydown", this.handleItemKeyDown);
        item.removeEventListener("focus", this.handleItemFocus);
      });
    };
    this.activeItemChange = (event) => {
      if (event.defaultPrevented || event.target !== event.currentTarget) {
        return;
      }
      event.preventDefault();
      const selectedItem = event.target;
      this.activeid = selectedItem.getAttribute("id");
      if (this.isSingleExpandMode()) {
        this.resetItems();
        selectedItem.expanded = true;
        selectedItem.setAttribute("aria-disabled", "true");
        this.accordionItems.forEach((item) => {
          if (!item.hasAttribute("disabled") && item.id !== this.activeid) {
            item.removeAttribute("aria-disabled");
          }
        });
      }
      this.activeItemIndex = Array.from(this.accordionItems).indexOf(selectedItem);
      this.change();
    };
    this.handleItemKeyDown = (event) => {
      if (event.target !== event.currentTarget) {
        return;
      }
      this.accordionIds = this.getItemIds();
      switch (event.key) {
        case keyArrowUp:
          event.preventDefault();
          this.adjust(-1);
          break;
        case keyArrowDown:
          event.preventDefault();
          this.adjust(1);
          break;
        case keyHome:
          this.activeItemIndex = 0;
          this.focusItem();
          break;
        case keyEnd:
          this.activeItemIndex = this.accordionItems.length - 1;
          this.focusItem();
          break;
      }
    };
    this.handleItemFocus = (event) => {
      if (event.target === event.currentTarget) {
        const focusedItem = event.target;
        const focusedIndex = this.activeItemIndex = Array.from(this.accordionItems).indexOf(focusedItem);
        if (this.activeItemIndex !== focusedIndex && focusedIndex !== -1) {
          this.activeItemIndex = focusedIndex;
          this.activeid = this.accordionIds[this.activeItemIndex];
        }
      }
    };
  }
  /**
   * @internal
   */
  accordionItemsChanged(oldValue, newValue) {
    if (this.$fastController.isConnected) {
      this.removeItemListeners(oldValue);
      this.setItems();
    }
  }
  findExpandedItem() {
    for (let item = 0; item < this.accordionItems.length; item++) {
      if (this.accordionItems[item].getAttribute("expanded") === "true") {
        return this.accordionItems[item];
      }
    }
    return null;
  }
  resetItems() {
    this.accordionItems.forEach((item, index) => {
      item.expanded = false;
    });
  }
  getItemIds() {
    return this.accordionItems.map((accordionItem) => {
      return accordionItem.getAttribute("id");
    });
  }
  isSingleExpandMode() {
    return this.expandmode === AccordionExpandMode.single;
  }
  adjust(adjustment) {
    this.activeItemIndex = wrapInBounds(0, this.accordionItems.length - 1, this.activeItemIndex + adjustment);
    this.focusItem();
  }
  focusItem() {
    const element = this.accordionItems[this.activeItemIndex];
    if (element instanceof AccordionItem) {
      element.expandbutton.focus();
    }
  }
};
__decorate([
  attr({ attribute: "expand-mode" })
], Accordion.prototype, "expandmode", void 0);
__decorate([
  observable
], Accordion.prototype, "accordionItems", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.template.js
var anchorTemplate = (context, definition) => html2`
    <a
        class="control"
        part="control"
        download="${(x) => x.download}"
        href="${(x) => x.href}"
        hreflang="${(x) => x.hreflang}"
        ping="${(x) => x.ping}"
        referrerpolicy="${(x) => x.referrerpolicy}"
        rel="${(x) => x.rel}"
        target="${(x) => x.target}"
        type="${(x) => x.type}"
        aria-atomic="${(x) => x.ariaAtomic}"
        aria-busy="${(x) => x.ariaBusy}"
        aria-controls="${(x) => x.ariaControls}"
        aria-current="${(x) => x.ariaCurrent}"
        aria-describedby="${(x) => x.ariaDescribedby}"
        aria-details="${(x) => x.ariaDetails}"
        aria-disabled="${(x) => x.ariaDisabled}"
        aria-errormessage="${(x) => x.ariaErrormessage}"
        aria-expanded="${(x) => x.ariaExpanded}"
        aria-flowto="${(x) => x.ariaFlowto}"
        aria-haspopup="${(x) => x.ariaHaspopup}"
        aria-hidden="${(x) => x.ariaHidden}"
        aria-invalid="${(x) => x.ariaInvalid}"
        aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
        aria-label="${(x) => x.ariaLabel}"
        aria-labelledby="${(x) => x.ariaLabelledby}"
        aria-live="${(x) => x.ariaLive}"
        aria-owns="${(x) => x.ariaOwns}"
        aria-relevant="${(x) => x.ariaRelevant}"
        aria-roledescription="${(x) => x.ariaRoledescription}"
        ${ref("control")}
    >
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot ${slotted("defaultSlottedContent")}></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </a>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/patterns/aria-global.js
var ARIAGlobalStatesAndProperties = class {
};
__decorate([
  attr({ attribute: "aria-atomic" })
], ARIAGlobalStatesAndProperties.prototype, "ariaAtomic", void 0);
__decorate([
  attr({ attribute: "aria-busy" })
], ARIAGlobalStatesAndProperties.prototype, "ariaBusy", void 0);
__decorate([
  attr({ attribute: "aria-controls" })
], ARIAGlobalStatesAndProperties.prototype, "ariaControls", void 0);
__decorate([
  attr({ attribute: "aria-current" })
], ARIAGlobalStatesAndProperties.prototype, "ariaCurrent", void 0);
__decorate([
  attr({ attribute: "aria-describedby" })
], ARIAGlobalStatesAndProperties.prototype, "ariaDescribedby", void 0);
__decorate([
  attr({ attribute: "aria-details" })
], ARIAGlobalStatesAndProperties.prototype, "ariaDetails", void 0);
__decorate([
  attr({ attribute: "aria-disabled" })
], ARIAGlobalStatesAndProperties.prototype, "ariaDisabled", void 0);
__decorate([
  attr({ attribute: "aria-errormessage" })
], ARIAGlobalStatesAndProperties.prototype, "ariaErrormessage", void 0);
__decorate([
  attr({ attribute: "aria-flowto" })
], ARIAGlobalStatesAndProperties.prototype, "ariaFlowto", void 0);
__decorate([
  attr({ attribute: "aria-haspopup" })
], ARIAGlobalStatesAndProperties.prototype, "ariaHaspopup", void 0);
__decorate([
  attr({ attribute: "aria-hidden" })
], ARIAGlobalStatesAndProperties.prototype, "ariaHidden", void 0);
__decorate([
  attr({ attribute: "aria-invalid" })
], ARIAGlobalStatesAndProperties.prototype, "ariaInvalid", void 0);
__decorate([
  attr({ attribute: "aria-keyshortcuts" })
], ARIAGlobalStatesAndProperties.prototype, "ariaKeyshortcuts", void 0);
__decorate([
  attr({ attribute: "aria-label" })
], ARIAGlobalStatesAndProperties.prototype, "ariaLabel", void 0);
__decorate([
  attr({ attribute: "aria-labelledby" })
], ARIAGlobalStatesAndProperties.prototype, "ariaLabelledby", void 0);
__decorate([
  attr({ attribute: "aria-live" })
], ARIAGlobalStatesAndProperties.prototype, "ariaLive", void 0);
__decorate([
  attr({ attribute: "aria-owns" })
], ARIAGlobalStatesAndProperties.prototype, "ariaOwns", void 0);
__decorate([
  attr({ attribute: "aria-relevant" })
], ARIAGlobalStatesAndProperties.prototype, "ariaRelevant", void 0);
__decorate([
  attr({ attribute: "aria-roledescription" })
], ARIAGlobalStatesAndProperties.prototype, "ariaRoledescription", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.js
var Anchor = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.handleUnsupportedDelegatesFocus = () => {
      var _a;
      if (window.ShadowRoot && !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") && ((_a = this.$fastController.definition.shadowOptions) === null || _a === void 0 ? void 0 : _a.delegatesFocus)) {
        this.focus = () => {
          var _a2;
          (_a2 = this.control) === null || _a2 === void 0 ? void 0 : _a2.focus();
        };
      }
    };
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.handleUnsupportedDelegatesFocus();
  }
};
__decorate([
  attr
], Anchor.prototype, "download", void 0);
__decorate([
  attr
], Anchor.prototype, "href", void 0);
__decorate([
  attr
], Anchor.prototype, "hreflang", void 0);
__decorate([
  attr
], Anchor.prototype, "ping", void 0);
__decorate([
  attr
], Anchor.prototype, "referrerpolicy", void 0);
__decorate([
  attr
], Anchor.prototype, "rel", void 0);
__decorate([
  attr
], Anchor.prototype, "target", void 0);
__decorate([
  attr
], Anchor.prototype, "type", void 0);
__decorate([
  observable
], Anchor.prototype, "defaultSlottedContent", void 0);
var DelegatesARIALink = class {
};
__decorate([
  attr({ attribute: "aria-expanded" })
], DelegatesARIALink.prototype, "ariaExpanded", void 0);
applyMixins(DelegatesARIALink, ARIAGlobalStatesAndProperties);
applyMixins(Anchor, StartEnd, DelegatesARIALink);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/anchored-region/anchored-region.template.js
var anchoredRegionTemplate = (context, definition) => html2`
    <template class="${(x) => x.initialLayoutComplete ? "loaded" : ""}">
        ${when((x) => x.initialLayoutComplete, html2`
                <slot></slot>
            `)}
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/direction.js
var getDirection = (rootNode) => {
  const dirNode = rootNode.closest("[dir]");
  return dirNode !== null && dirNode.dir === "rtl" ? Direction.rtl : Direction.ltr;
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/intersection-service.js
var IntersectionService = class {
  constructor() {
    this.intersectionDetector = null;
    this.observedElements = /* @__PURE__ */ new Map();
    this.requestPosition = (target2, callback) => {
      var _a;
      if (this.intersectionDetector === null) {
        return;
      }
      if (this.observedElements.has(target2)) {
        (_a = this.observedElements.get(target2)) === null || _a === void 0 ? void 0 : _a.push(callback);
        return;
      }
      this.observedElements.set(target2, [callback]);
      this.intersectionDetector.observe(target2);
    };
    this.cancelRequestPosition = (target2, callback) => {
      const callbacks = this.observedElements.get(target2);
      if (callbacks !== void 0) {
        const callBackIndex = callbacks.indexOf(callback);
        if (callBackIndex !== -1) {
          callbacks.splice(callBackIndex, 1);
        }
      }
    };
    this.initializeIntersectionDetector = () => {
      if (!$global.IntersectionObserver) {
        return;
      }
      this.intersectionDetector = new IntersectionObserver(this.handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1]
      });
    };
    this.handleIntersection = (entries) => {
      if (this.intersectionDetector === null) {
        return;
      }
      const pendingCallbacks = [];
      const pendingCallbackParams = [];
      entries.forEach((entry) => {
        var _a;
        (_a = this.intersectionDetector) === null || _a === void 0 ? void 0 : _a.unobserve(entry.target);
        const thisElementCallbacks = this.observedElements.get(entry.target);
        if (thisElementCallbacks !== void 0) {
          thisElementCallbacks.forEach((callback) => {
            let targetCallbackIndex = pendingCallbacks.indexOf(callback);
            if (targetCallbackIndex === -1) {
              targetCallbackIndex = pendingCallbacks.length;
              pendingCallbacks.push(callback);
              pendingCallbackParams.push([]);
            }
            pendingCallbackParams[targetCallbackIndex].push(entry);
          });
          this.observedElements.delete(entry.target);
        }
      });
      pendingCallbacks.forEach((callback, index) => {
        callback(pendingCallbackParams[index]);
      });
    };
    this.initializeIntersectionDetector();
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/anchored-region/anchored-region.js
var AnchoredRegion = class _AnchoredRegion extends FoundationElement {
  constructor() {
    super(...arguments);
    this.anchor = "";
    this.viewport = "";
    this.horizontalPositioningMode = "uncontrolled";
    this.horizontalDefaultPosition = "unset";
    this.horizontalViewportLock = false;
    this.horizontalInset = false;
    this.horizontalScaling = "content";
    this.verticalPositioningMode = "uncontrolled";
    this.verticalDefaultPosition = "unset";
    this.verticalViewportLock = false;
    this.verticalInset = false;
    this.verticalScaling = "content";
    this.fixedPlacement = false;
    this.autoUpdateMode = "anchor";
    this.anchorElement = null;
    this.viewportElement = null;
    this.initialLayoutComplete = false;
    this.resizeDetector = null;
    this.baseHorizontalOffset = 0;
    this.baseVerticalOffset = 0;
    this.pendingPositioningUpdate = false;
    this.pendingReset = false;
    this.currentDirection = Direction.ltr;
    this.regionVisible = false;
    this.forceUpdate = false;
    this.updateThreshold = 0.5;
    this.update = () => {
      if (!this.pendingPositioningUpdate) {
        this.requestPositionUpdates();
      }
    };
    this.startObservers = () => {
      this.stopObservers();
      if (this.anchorElement === null) {
        return;
      }
      this.requestPositionUpdates();
      if (this.resizeDetector !== null) {
        this.resizeDetector.observe(this.anchorElement);
        this.resizeDetector.observe(this);
      }
    };
    this.requestPositionUpdates = () => {
      if (this.anchorElement === null || this.pendingPositioningUpdate) {
        return;
      }
      _AnchoredRegion.intersectionService.requestPosition(this, this.handleIntersection);
      _AnchoredRegion.intersectionService.requestPosition(this.anchorElement, this.handleIntersection);
      if (this.viewportElement !== null) {
        _AnchoredRegion.intersectionService.requestPosition(this.viewportElement, this.handleIntersection);
      }
      this.pendingPositioningUpdate = true;
    };
    this.stopObservers = () => {
      if (this.pendingPositioningUpdate) {
        this.pendingPositioningUpdate = false;
        _AnchoredRegion.intersectionService.cancelRequestPosition(this, this.handleIntersection);
        if (this.anchorElement !== null) {
          _AnchoredRegion.intersectionService.cancelRequestPosition(this.anchorElement, this.handleIntersection);
        }
        if (this.viewportElement !== null) {
          _AnchoredRegion.intersectionService.cancelRequestPosition(this.viewportElement, this.handleIntersection);
        }
      }
      if (this.resizeDetector !== null) {
        this.resizeDetector.disconnect();
      }
    };
    this.getViewport = () => {
      if (typeof this.viewport !== "string" || this.viewport === "") {
        return document.documentElement;
      }
      return document.getElementById(this.viewport);
    };
    this.getAnchor = () => {
      return document.getElementById(this.anchor);
    };
    this.handleIntersection = (entries) => {
      if (!this.pendingPositioningUpdate) {
        return;
      }
      this.pendingPositioningUpdate = false;
      if (!this.applyIntersectionEntries(entries)) {
        return;
      }
      this.updateLayout();
    };
    this.applyIntersectionEntries = (entries) => {
      const regionEntry = entries.find((x) => x.target === this);
      const anchorEntry = entries.find((x) => x.target === this.anchorElement);
      const viewportEntry = entries.find((x) => x.target === this.viewportElement);
      if (regionEntry === void 0 || viewportEntry === void 0 || anchorEntry === void 0) {
        return false;
      }
      if (!this.regionVisible || this.forceUpdate || this.regionRect === void 0 || this.anchorRect === void 0 || this.viewportRect === void 0 || this.isRectDifferent(this.anchorRect, anchorEntry.boundingClientRect) || this.isRectDifferent(this.viewportRect, viewportEntry.boundingClientRect) || this.isRectDifferent(this.regionRect, regionEntry.boundingClientRect)) {
        this.regionRect = regionEntry.boundingClientRect;
        this.anchorRect = anchorEntry.boundingClientRect;
        if (this.viewportElement === document.documentElement) {
          this.viewportRect = new DOMRectReadOnly(viewportEntry.boundingClientRect.x + document.documentElement.scrollLeft, viewportEntry.boundingClientRect.y + document.documentElement.scrollTop, viewportEntry.boundingClientRect.width, viewportEntry.boundingClientRect.height);
        } else {
          this.viewportRect = viewportEntry.boundingClientRect;
        }
        this.updateRegionOffset();
        this.forceUpdate = false;
        return true;
      }
      return false;
    };
    this.updateRegionOffset = () => {
      if (this.anchorRect && this.regionRect) {
        this.baseHorizontalOffset = this.baseHorizontalOffset + (this.anchorRect.left - this.regionRect.left) + (this.translateX - this.baseHorizontalOffset);
        this.baseVerticalOffset = this.baseVerticalOffset + (this.anchorRect.top - this.regionRect.top) + (this.translateY - this.baseVerticalOffset);
      }
    };
    this.isRectDifferent = (rectA, rectB) => {
      if (Math.abs(rectA.top - rectB.top) > this.updateThreshold || Math.abs(rectA.right - rectB.right) > this.updateThreshold || Math.abs(rectA.bottom - rectB.bottom) > this.updateThreshold || Math.abs(rectA.left - rectB.left) > this.updateThreshold) {
        return true;
      }
      return false;
    };
    this.handleResize = (entries) => {
      this.update();
    };
    this.reset = () => {
      if (!this.pendingReset) {
        return;
      }
      this.pendingReset = false;
      if (this.anchorElement === null) {
        this.anchorElement = this.getAnchor();
      }
      if (this.viewportElement === null) {
        this.viewportElement = this.getViewport();
      }
      this.currentDirection = getDirection(this);
      this.startObservers();
    };
    this.updateLayout = () => {
      let desiredVerticalPosition = void 0;
      let desiredHorizontalPosition = void 0;
      if (this.horizontalPositioningMode !== "uncontrolled") {
        const horizontalOptions = this.getPositioningOptions(this.horizontalInset);
        if (this.horizontalDefaultPosition === "center") {
          desiredHorizontalPosition = "center";
        } else if (this.horizontalDefaultPosition !== "unset") {
          let dirCorrectedHorizontalDefaultPosition = this.horizontalDefaultPosition;
          if (dirCorrectedHorizontalDefaultPosition === "start" || dirCorrectedHorizontalDefaultPosition === "end") {
            const newDirection = getDirection(this);
            if (newDirection !== this.currentDirection) {
              this.currentDirection = newDirection;
              this.initialize();
              return;
            }
            if (this.currentDirection === Direction.ltr) {
              dirCorrectedHorizontalDefaultPosition = dirCorrectedHorizontalDefaultPosition === "start" ? "left" : "right";
            } else {
              dirCorrectedHorizontalDefaultPosition = dirCorrectedHorizontalDefaultPosition === "start" ? "right" : "left";
            }
          }
          switch (dirCorrectedHorizontalDefaultPosition) {
            case "left":
              desiredHorizontalPosition = this.horizontalInset ? "insetStart" : "start";
              break;
            case "right":
              desiredHorizontalPosition = this.horizontalInset ? "insetEnd" : "end";
              break;
          }
        }
        const horizontalThreshold = this.horizontalThreshold !== void 0 ? this.horizontalThreshold : this.regionRect !== void 0 ? this.regionRect.width : 0;
        const anchorLeft = this.anchorRect !== void 0 ? this.anchorRect.left : 0;
        const anchorRight = this.anchorRect !== void 0 ? this.anchorRect.right : 0;
        const anchorWidth = this.anchorRect !== void 0 ? this.anchorRect.width : 0;
        const viewportLeft = this.viewportRect !== void 0 ? this.viewportRect.left : 0;
        const viewportRight = this.viewportRect !== void 0 ? this.viewportRect.right : 0;
        if (desiredHorizontalPosition === void 0 || !(this.horizontalPositioningMode === "locktodefault") && this.getAvailableSpace(desiredHorizontalPosition, anchorLeft, anchorRight, anchorWidth, viewportLeft, viewportRight) < horizontalThreshold) {
          desiredHorizontalPosition = this.getAvailableSpace(horizontalOptions[0], anchorLeft, anchorRight, anchorWidth, viewportLeft, viewportRight) > this.getAvailableSpace(horizontalOptions[1], anchorLeft, anchorRight, anchorWidth, viewportLeft, viewportRight) ? horizontalOptions[0] : horizontalOptions[1];
        }
      }
      if (this.verticalPositioningMode !== "uncontrolled") {
        const verticalOptions = this.getPositioningOptions(this.verticalInset);
        if (this.verticalDefaultPosition === "center") {
          desiredVerticalPosition = "center";
        } else if (this.verticalDefaultPosition !== "unset") {
          switch (this.verticalDefaultPosition) {
            case "top":
              desiredVerticalPosition = this.verticalInset ? "insetStart" : "start";
              break;
            case "bottom":
              desiredVerticalPosition = this.verticalInset ? "insetEnd" : "end";
              break;
          }
        }
        const verticalThreshold = this.verticalThreshold !== void 0 ? this.verticalThreshold : this.regionRect !== void 0 ? this.regionRect.height : 0;
        const anchorTop = this.anchorRect !== void 0 ? this.anchorRect.top : 0;
        const anchorBottom = this.anchorRect !== void 0 ? this.anchorRect.bottom : 0;
        const anchorHeight = this.anchorRect !== void 0 ? this.anchorRect.height : 0;
        const viewportTop = this.viewportRect !== void 0 ? this.viewportRect.top : 0;
        const viewportBottom = this.viewportRect !== void 0 ? this.viewportRect.bottom : 0;
        if (desiredVerticalPosition === void 0 || !(this.verticalPositioningMode === "locktodefault") && this.getAvailableSpace(desiredVerticalPosition, anchorTop, anchorBottom, anchorHeight, viewportTop, viewportBottom) < verticalThreshold) {
          desiredVerticalPosition = this.getAvailableSpace(verticalOptions[0], anchorTop, anchorBottom, anchorHeight, viewportTop, viewportBottom) > this.getAvailableSpace(verticalOptions[1], anchorTop, anchorBottom, anchorHeight, viewportTop, viewportBottom) ? verticalOptions[0] : verticalOptions[1];
        }
      }
      const nextPositionerDimension = this.getNextRegionDimension(desiredHorizontalPosition, desiredVerticalPosition);
      const positionChanged = this.horizontalPosition !== desiredHorizontalPosition || this.verticalPosition !== desiredVerticalPosition;
      this.setHorizontalPosition(desiredHorizontalPosition, nextPositionerDimension);
      this.setVerticalPosition(desiredVerticalPosition, nextPositionerDimension);
      this.updateRegionStyle();
      if (!this.initialLayoutComplete) {
        this.initialLayoutComplete = true;
        this.requestPositionUpdates();
        return;
      }
      if (!this.regionVisible) {
        this.regionVisible = true;
        this.style.removeProperty("pointer-events");
        this.style.removeProperty("opacity");
        this.classList.toggle("loaded", true);
        this.$emit("loaded", this, { bubbles: false });
      }
      this.updatePositionClasses();
      if (positionChanged) {
        this.$emit("positionchange", this, { bubbles: false });
      }
    };
    this.updateRegionStyle = () => {
      this.style.width = this.regionWidth;
      this.style.height = this.regionHeight;
      this.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
    };
    this.updatePositionClasses = () => {
      this.classList.toggle("top", this.verticalPosition === "start");
      this.classList.toggle("bottom", this.verticalPosition === "end");
      this.classList.toggle("inset-top", this.verticalPosition === "insetStart");
      this.classList.toggle("inset-bottom", this.verticalPosition === "insetEnd");
      this.classList.toggle("vertical-center", this.verticalPosition === "center");
      this.classList.toggle("left", this.horizontalPosition === "start");
      this.classList.toggle("right", this.horizontalPosition === "end");
      this.classList.toggle("inset-left", this.horizontalPosition === "insetStart");
      this.classList.toggle("inset-right", this.horizontalPosition === "insetEnd");
      this.classList.toggle("horizontal-center", this.horizontalPosition === "center");
    };
    this.setHorizontalPosition = (desiredHorizontalPosition, nextPositionerDimension) => {
      if (desiredHorizontalPosition === void 0 || this.regionRect === void 0 || this.anchorRect === void 0 || this.viewportRect === void 0) {
        return;
      }
      let nextRegionWidth = 0;
      switch (this.horizontalScaling) {
        case "anchor":
        case "fill":
          nextRegionWidth = this.horizontalViewportLock ? this.viewportRect.width : nextPositionerDimension.width;
          this.regionWidth = `${nextRegionWidth}px`;
          break;
        case "content":
          nextRegionWidth = this.regionRect.width;
          this.regionWidth = "unset";
          break;
      }
      let sizeDelta = 0;
      switch (desiredHorizontalPosition) {
        case "start":
          this.translateX = this.baseHorizontalOffset - nextRegionWidth;
          if (this.horizontalViewportLock && this.anchorRect.left > this.viewportRect.right) {
            this.translateX = this.translateX - (this.anchorRect.left - this.viewportRect.right);
          }
          break;
        case "insetStart":
          this.translateX = this.baseHorizontalOffset - nextRegionWidth + this.anchorRect.width;
          if (this.horizontalViewportLock && this.anchorRect.right > this.viewportRect.right) {
            this.translateX = this.translateX - (this.anchorRect.right - this.viewportRect.right);
          }
          break;
        case "insetEnd":
          this.translateX = this.baseHorizontalOffset;
          if (this.horizontalViewportLock && this.anchorRect.left < this.viewportRect.left) {
            this.translateX = this.translateX - (this.anchorRect.left - this.viewportRect.left);
          }
          break;
        case "end":
          this.translateX = this.baseHorizontalOffset + this.anchorRect.width;
          if (this.horizontalViewportLock && this.anchorRect.right < this.viewportRect.left) {
            this.translateX = this.translateX - (this.anchorRect.right - this.viewportRect.left);
          }
          break;
        case "center":
          sizeDelta = (this.anchorRect.width - nextRegionWidth) / 2;
          this.translateX = this.baseHorizontalOffset + sizeDelta;
          if (this.horizontalViewportLock) {
            const regionLeft = this.anchorRect.left + sizeDelta;
            const regionRight = this.anchorRect.right - sizeDelta;
            if (regionLeft < this.viewportRect.left && !(regionRight > this.viewportRect.right)) {
              this.translateX = this.translateX - (regionLeft - this.viewportRect.left);
            } else if (regionRight > this.viewportRect.right && !(regionLeft < this.viewportRect.left)) {
              this.translateX = this.translateX - (regionRight - this.viewportRect.right);
            }
          }
          break;
      }
      this.horizontalPosition = desiredHorizontalPosition;
    };
    this.setVerticalPosition = (desiredVerticalPosition, nextPositionerDimension) => {
      if (desiredVerticalPosition === void 0 || this.regionRect === void 0 || this.anchorRect === void 0 || this.viewportRect === void 0) {
        return;
      }
      let nextRegionHeight = 0;
      switch (this.verticalScaling) {
        case "anchor":
        case "fill":
          nextRegionHeight = this.verticalViewportLock ? this.viewportRect.height : nextPositionerDimension.height;
          this.regionHeight = `${nextRegionHeight}px`;
          break;
        case "content":
          nextRegionHeight = this.regionRect.height;
          this.regionHeight = "unset";
          break;
      }
      let sizeDelta = 0;
      switch (desiredVerticalPosition) {
        case "start":
          this.translateY = this.baseVerticalOffset - nextRegionHeight;
          if (this.verticalViewportLock && this.anchorRect.top > this.viewportRect.bottom) {
            this.translateY = this.translateY - (this.anchorRect.top - this.viewportRect.bottom);
          }
          break;
        case "insetStart":
          this.translateY = this.baseVerticalOffset - nextRegionHeight + this.anchorRect.height;
          if (this.verticalViewportLock && this.anchorRect.bottom > this.viewportRect.bottom) {
            this.translateY = this.translateY - (this.anchorRect.bottom - this.viewportRect.bottom);
          }
          break;
        case "insetEnd":
          this.translateY = this.baseVerticalOffset;
          if (this.verticalViewportLock && this.anchorRect.top < this.viewportRect.top) {
            this.translateY = this.translateY - (this.anchorRect.top - this.viewportRect.top);
          }
          break;
        case "end":
          this.translateY = this.baseVerticalOffset + this.anchorRect.height;
          if (this.verticalViewportLock && this.anchorRect.bottom < this.viewportRect.top) {
            this.translateY = this.translateY - (this.anchorRect.bottom - this.viewportRect.top);
          }
          break;
        case "center":
          sizeDelta = (this.anchorRect.height - nextRegionHeight) / 2;
          this.translateY = this.baseVerticalOffset + sizeDelta;
          if (this.verticalViewportLock) {
            const regionTop = this.anchorRect.top + sizeDelta;
            const regionBottom = this.anchorRect.bottom - sizeDelta;
            if (regionTop < this.viewportRect.top && !(regionBottom > this.viewportRect.bottom)) {
              this.translateY = this.translateY - (regionTop - this.viewportRect.top);
            } else if (regionBottom > this.viewportRect.bottom && !(regionTop < this.viewportRect.top)) {
              this.translateY = this.translateY - (regionBottom - this.viewportRect.bottom);
            }
          }
      }
      this.verticalPosition = desiredVerticalPosition;
    };
    this.getPositioningOptions = (inset) => {
      if (inset) {
        return ["insetStart", "insetEnd"];
      }
      return ["start", "end"];
    };
    this.getAvailableSpace = (positionOption, anchorStart, anchorEnd, anchorSpan, viewportStart, viewportEnd) => {
      const spaceStart = anchorStart - viewportStart;
      const spaceEnd = viewportEnd - (anchorStart + anchorSpan);
      switch (positionOption) {
        case "start":
          return spaceStart;
        case "insetStart":
          return spaceStart + anchorSpan;
        case "insetEnd":
          return spaceEnd + anchorSpan;
        case "end":
          return spaceEnd;
        case "center":
          return Math.min(spaceStart, spaceEnd) * 2 + anchorSpan;
      }
    };
    this.getNextRegionDimension = (desiredHorizontalPosition, desiredVerticalPosition) => {
      const newRegionDimension = {
        height: this.regionRect !== void 0 ? this.regionRect.height : 0,
        width: this.regionRect !== void 0 ? this.regionRect.width : 0
      };
      if (desiredHorizontalPosition !== void 0 && this.horizontalScaling === "fill") {
        newRegionDimension.width = this.getAvailableSpace(desiredHorizontalPosition, this.anchorRect !== void 0 ? this.anchorRect.left : 0, this.anchorRect !== void 0 ? this.anchorRect.right : 0, this.anchorRect !== void 0 ? this.anchorRect.width : 0, this.viewportRect !== void 0 ? this.viewportRect.left : 0, this.viewportRect !== void 0 ? this.viewportRect.right : 0);
      } else if (this.horizontalScaling === "anchor") {
        newRegionDimension.width = this.anchorRect !== void 0 ? this.anchorRect.width : 0;
      }
      if (desiredVerticalPosition !== void 0 && this.verticalScaling === "fill") {
        newRegionDimension.height = this.getAvailableSpace(desiredVerticalPosition, this.anchorRect !== void 0 ? this.anchorRect.top : 0, this.anchorRect !== void 0 ? this.anchorRect.bottom : 0, this.anchorRect !== void 0 ? this.anchorRect.height : 0, this.viewportRect !== void 0 ? this.viewportRect.top : 0, this.viewportRect !== void 0 ? this.viewportRect.bottom : 0);
      } else if (this.verticalScaling === "anchor") {
        newRegionDimension.height = this.anchorRect !== void 0 ? this.anchorRect.height : 0;
      }
      return newRegionDimension;
    };
    this.startAutoUpdateEventListeners = () => {
      window.addEventListener(eventResize, this.update, { passive: true });
      window.addEventListener(eventScroll, this.update, {
        passive: true,
        capture: true
      });
      if (this.resizeDetector !== null && this.viewportElement !== null) {
        this.resizeDetector.observe(this.viewportElement);
      }
    };
    this.stopAutoUpdateEventListeners = () => {
      window.removeEventListener(eventResize, this.update);
      window.removeEventListener(eventScroll, this.update);
      if (this.resizeDetector !== null && this.viewportElement !== null) {
        this.resizeDetector.unobserve(this.viewportElement);
      }
    };
  }
  anchorChanged() {
    if (this.initialLayoutComplete) {
      this.anchorElement = this.getAnchor();
    }
  }
  viewportChanged() {
    if (this.initialLayoutComplete) {
      this.viewportElement = this.getViewport();
    }
  }
  horizontalPositioningModeChanged() {
    this.requestReset();
  }
  horizontalDefaultPositionChanged() {
    this.updateForAttributeChange();
  }
  horizontalViewportLockChanged() {
    this.updateForAttributeChange();
  }
  horizontalInsetChanged() {
    this.updateForAttributeChange();
  }
  horizontalThresholdChanged() {
    this.updateForAttributeChange();
  }
  horizontalScalingChanged() {
    this.updateForAttributeChange();
  }
  verticalPositioningModeChanged() {
    this.requestReset();
  }
  verticalDefaultPositionChanged() {
    this.updateForAttributeChange();
  }
  verticalViewportLockChanged() {
    this.updateForAttributeChange();
  }
  verticalInsetChanged() {
    this.updateForAttributeChange();
  }
  verticalThresholdChanged() {
    this.updateForAttributeChange();
  }
  verticalScalingChanged() {
    this.updateForAttributeChange();
  }
  fixedPlacementChanged() {
    if (this.$fastController.isConnected && this.initialLayoutComplete) {
      this.initialize();
    }
  }
  autoUpdateModeChanged(prevMode, newMode) {
    if (this.$fastController.isConnected && this.initialLayoutComplete) {
      if (prevMode === "auto") {
        this.stopAutoUpdateEventListeners();
      }
      if (newMode === "auto") {
        this.startAutoUpdateEventListeners();
      }
    }
  }
  anchorElementChanged() {
    this.requestReset();
  }
  viewportElementChanged() {
    if (this.$fastController.isConnected && this.initialLayoutComplete) {
      this.initialize();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.autoUpdateMode === "auto") {
      this.startAutoUpdateEventListeners();
    }
    this.initialize();
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.autoUpdateMode === "auto") {
      this.stopAutoUpdateEventListeners();
    }
    this.stopObservers();
    this.disconnectResizeDetector();
  }
  /**
   * @internal
   */
  adoptedCallback() {
    this.initialize();
  }
  /**
   * destroys the instance's resize observer
   */
  disconnectResizeDetector() {
    if (this.resizeDetector !== null) {
      this.resizeDetector.disconnect();
      this.resizeDetector = null;
    }
  }
  /**
   * initializes the instance's resize observer
   */
  initializeResizeDetector() {
    this.disconnectResizeDetector();
    this.resizeDetector = new window.ResizeObserver(this.handleResize);
  }
  /**
   * react to attribute changes that don't require a reset
   */
  updateForAttributeChange() {
    if (this.$fastController.isConnected && this.initialLayoutComplete) {
      this.forceUpdate = true;
      this.update();
    }
  }
  /**
   * fully initializes the component
   */
  initialize() {
    this.initializeResizeDetector();
    if (this.anchorElement === null) {
      this.anchorElement = this.getAnchor();
    }
    this.requestReset();
  }
  /**
   * Request a reset if there are currently no open requests
   */
  requestReset() {
    if (this.$fastController.isConnected && this.pendingReset === false) {
      this.setInitialState();
      DOM.queueUpdate(() => this.reset());
      this.pendingReset = true;
    }
  }
  /**
   * sets the starting configuration for component internal values
   */
  setInitialState() {
    this.initialLayoutComplete = false;
    this.regionVisible = false;
    this.translateX = 0;
    this.translateY = 0;
    this.baseHorizontalOffset = 0;
    this.baseVerticalOffset = 0;
    this.viewportRect = void 0;
    this.regionRect = void 0;
    this.anchorRect = void 0;
    this.verticalPosition = void 0;
    this.horizontalPosition = void 0;
    this.style.opacity = "0";
    this.style.pointerEvents = "none";
    this.forceUpdate = false;
    this.style.position = this.fixedPlacement ? "fixed" : "absolute";
    this.updatePositionClasses();
    this.updateRegionStyle();
  }
};
AnchoredRegion.intersectionService = new IntersectionService();
__decorate([
  attr
], AnchoredRegion.prototype, "anchor", void 0);
__decorate([
  attr
], AnchoredRegion.prototype, "viewport", void 0);
__decorate([
  attr({ attribute: "horizontal-positioning-mode" })
], AnchoredRegion.prototype, "horizontalPositioningMode", void 0);
__decorate([
  attr({ attribute: "horizontal-default-position" })
], AnchoredRegion.prototype, "horizontalDefaultPosition", void 0);
__decorate([
  attr({ attribute: "horizontal-viewport-lock", mode: "boolean" })
], AnchoredRegion.prototype, "horizontalViewportLock", void 0);
__decorate([
  attr({ attribute: "horizontal-inset", mode: "boolean" })
], AnchoredRegion.prototype, "horizontalInset", void 0);
__decorate([
  attr({ attribute: "horizontal-threshold" })
], AnchoredRegion.prototype, "horizontalThreshold", void 0);
__decorate([
  attr({ attribute: "horizontal-scaling" })
], AnchoredRegion.prototype, "horizontalScaling", void 0);
__decorate([
  attr({ attribute: "vertical-positioning-mode" })
], AnchoredRegion.prototype, "verticalPositioningMode", void 0);
__decorate([
  attr({ attribute: "vertical-default-position" })
], AnchoredRegion.prototype, "verticalDefaultPosition", void 0);
__decorate([
  attr({ attribute: "vertical-viewport-lock", mode: "boolean" })
], AnchoredRegion.prototype, "verticalViewportLock", void 0);
__decorate([
  attr({ attribute: "vertical-inset", mode: "boolean" })
], AnchoredRegion.prototype, "verticalInset", void 0);
__decorate([
  attr({ attribute: "vertical-threshold" })
], AnchoredRegion.prototype, "verticalThreshold", void 0);
__decorate([
  attr({ attribute: "vertical-scaling" })
], AnchoredRegion.prototype, "verticalScaling", void 0);
__decorate([
  attr({ attribute: "fixed-placement", mode: "boolean" })
], AnchoredRegion.prototype, "fixedPlacement", void 0);
__decorate([
  attr({ attribute: "auto-update-mode" })
], AnchoredRegion.prototype, "autoUpdateMode", void 0);
__decorate([
  observable
], AnchoredRegion.prototype, "anchorElement", void 0);
__decorate([
  observable
], AnchoredRegion.prototype, "viewportElement", void 0);
__decorate([
  observable
], AnchoredRegion.prototype, "initialLayoutComplete", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/anchored-region/anchored-region-config.js
var horizontalAnchorOverlay = {
  horizontalDefaultPosition: "center",
  horizontalPositioningMode: "locktodefault",
  horizontalInset: false,
  horizontalScaling: "anchor"
};
var FlyoutPosTop = Object.assign(Object.assign({}, horizontalAnchorOverlay), { verticalDefaultPosition: "top", verticalPositioningMode: "locktodefault", verticalInset: false, verticalScaling: "content" });
var FlyoutPosBottom = Object.assign(Object.assign({}, horizontalAnchorOverlay), { verticalDefaultPosition: "bottom", verticalPositioningMode: "locktodefault", verticalInset: false, verticalScaling: "content" });
var FlyoutPosTallest = Object.assign(Object.assign({}, horizontalAnchorOverlay), { verticalPositioningMode: "dynamic", verticalInset: false, verticalScaling: "content" });
var FlyoutPosTopFill = Object.assign(Object.assign({}, FlyoutPosTop), { verticalScaling: "fill" });
var FlyoutPosBottomFill = Object.assign(Object.assign({}, FlyoutPosBottom), { verticalScaling: "fill" });
var FlyoutPosTallestFill = Object.assign(Object.assign({}, FlyoutPosTallest), { verticalScaling: "fill" });

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/avatar/avatar.js
var Avatar = class extends FoundationElement {
  /**
   * Internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.shape) {
      this.shape = "circle";
    }
  }
};
__decorate([
  attr
], Avatar.prototype, "fill", void 0);
__decorate([
  attr
], Avatar.prototype, "color", void 0);
__decorate([
  attr
], Avatar.prototype, "link", void 0);
__decorate([
  attr
], Avatar.prototype, "shape", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/badge/badge.template.js
var badgeTemplate = (context, definition) => html2`
    <template class="${(x) => x.circular ? "circular" : ""}">
        <div class="control" part="control" style="${(x) => x.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/badge/badge.js
var Badge = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.generateBadgeStyle = () => {
      if (!this.fill && !this.color) {
        return;
      }
      const fill = `background-color: var(--badge-fill-${this.fill});`;
      const color = `color: var(--badge-color-${this.color});`;
      if (this.fill && !this.color) {
        return fill;
      } else if (this.color && !this.fill) {
        return color;
      } else {
        return `${color} ${fill}`;
      }
    };
  }
};
__decorate([
  attr({ attribute: "fill" })
], Badge.prototype, "fill", void 0);
__decorate([
  attr({ attribute: "color" })
], Badge.prototype, "color", void 0);
__decorate([
  attr({ mode: "boolean" })
], Badge.prototype, "circular", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/breadcrumb-item/breadcrumb-item.template.js
var breadcrumbItemTemplate = (context, definition) => html2`
    <div role="listitem" class="listitem" part="listitem">
        ${when((x) => x.href && x.href.length > 0, html2`
                ${anchorTemplate(context, definition)}
            `)}
        ${when((x) => !x.href, html2`
                ${startSlotTemplate(context, definition)}
                <slot></slot>
                ${endSlotTemplate(context, definition)}
            `)}
        ${when((x) => x.separator, html2`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">${definition.separator || ""}</slot>
                </span>
            `)}
    </div>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/breadcrumb-item/breadcrumb-item.js
var BreadcrumbItem = class extends Anchor {
  constructor() {
    super(...arguments);
    this.separator = true;
  }
};
__decorate([
  observable
], BreadcrumbItem.prototype, "separator", void 0);
applyMixins(BreadcrumbItem, StartEnd, DelegatesARIALink);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/breadcrumb/breadcrumb.template.js
var breadcrumbTemplate = (context, definition) => html2`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
            ></slot>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/breadcrumb/breadcrumb.js
var Breadcrumb = class extends FoundationElement {
  slottedBreadcrumbItemsChanged() {
    if (this.$fastController.isConnected) {
      if (this.slottedBreadcrumbItems === void 0 || this.slottedBreadcrumbItems.length === 0) {
        return;
      }
      const lastNode = this.slottedBreadcrumbItems[this.slottedBreadcrumbItems.length - 1];
      this.slottedBreadcrumbItems.forEach((item) => {
        const itemIsLastNode = item === lastNode;
        this.setItemSeparator(item, itemIsLastNode);
        this.setAriaCurrent(item, itemIsLastNode);
      });
    }
  }
  setItemSeparator(item, isLastNode) {
    if (item instanceof BreadcrumbItem) {
      item.separator = !isLastNode;
    }
  }
  /**
   * Finds href on childnodes in the light DOM or shadow DOM.
   * We look in the shadow DOM because we insert an anchor when breadcrumb-item has an href.
   */
  findChildWithHref(node) {
    var _a, _b;
    if (node.childElementCount > 0) {
      return node.querySelector("a[href]");
    } else if ((_a = node.shadowRoot) === null || _a === void 0 ? void 0 : _a.childElementCount) {
      return (_b = node.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("a[href]");
    } else
      return null;
  }
  /**
   *  Sets ARIA Current for the current node
   * If child node with an anchor tag and with href is found then set aria-current to correct value for the child node,
   * otherwise apply aria-current to the host element, with an href
   */
  setAriaCurrent(item, isLastNode) {
    const childNodeWithHref = this.findChildWithHref(item);
    if (childNodeWithHref === null && item.hasAttribute("href") && item instanceof BreadcrumbItem) {
      isLastNode ? item.setAttribute("aria-current", "page") : item.removeAttribute("aria-current");
    } else if (childNodeWithHref !== null) {
      isLastNode ? childNodeWithHref.setAttribute("aria-current", "page") : childNodeWithHref.removeAttribute("aria-current");
    }
  }
};
__decorate([
  observable
], Breadcrumb.prototype, "slottedBreadcrumbItems", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/button/button.template.js
var buttonTemplate = (context, definition) => html2`
    <button
        class="control"
        part="control"
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        form="${(x) => x.formId}"
        formaction="${(x) => x.formaction}"
        formenctype="${(x) => x.formenctype}"
        formmethod="${(x) => x.formmethod}"
        formnovalidate="${(x) => x.formnovalidate}"
        formtarget="${(x) => x.formtarget}"
        name="${(x) => x.name}"
        type="${(x) => x.type}"
        value="${(x) => x.value}"
        aria-atomic="${(x) => x.ariaAtomic}"
        aria-busy="${(x) => x.ariaBusy}"
        aria-controls="${(x) => x.ariaControls}"
        aria-current="${(x) => x.ariaCurrent}"
        aria-describedby="${(x) => x.ariaDescribedby}"
        aria-details="${(x) => x.ariaDetails}"
        aria-disabled="${(x) => x.ariaDisabled}"
        aria-errormessage="${(x) => x.ariaErrormessage}"
        aria-expanded="${(x) => x.ariaExpanded}"
        aria-flowto="${(x) => x.ariaFlowto}"
        aria-haspopup="${(x) => x.ariaHaspopup}"
        aria-hidden="${(x) => x.ariaHidden}"
        aria-invalid="${(x) => x.ariaInvalid}"
        aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
        aria-label="${(x) => x.ariaLabel}"
        aria-labelledby="${(x) => x.ariaLabelledby}"
        aria-live="${(x) => x.ariaLive}"
        aria-owns="${(x) => x.ariaOwns}"
        aria-pressed="${(x) => x.ariaPressed}"
        aria-relevant="${(x) => x.ariaRelevant}"
        aria-roledescription="${(x) => x.ariaRoledescription}"
        ${ref("control")}
    >
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot ${slotted("defaultSlottedContent")}></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </button>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/form-associated/form-associated.js
var proxySlotName = "form-associated-proxy";
var ElementInternalsKey = "ElementInternals";
var supportsElementInternals = ElementInternalsKey in window && "setFormValue" in window[ElementInternalsKey].prototype;
var InternalsMap = /* @__PURE__ */ new WeakMap();
function FormAssociated(BaseCtor) {
  const C = class extends BaseCtor {
    constructor(...args) {
      super(...args);
      this.dirtyValue = false;
      this.disabled = false;
      this.proxyEventsToBlock = ["change", "click"];
      this.proxyInitialized = false;
      this.required = false;
      this.initialValue = this.initialValue || "";
      if (!this.elementInternals) {
        this.formResetCallback = this.formResetCallback.bind(this);
      }
    }
    /**
     * Must evaluate to true to enable elementInternals.
     * Feature detects API support and resolve respectively
     *
     * @internal
     */
    static get formAssociated() {
      return supportsElementInternals;
    }
    /**
     * Returns the validity state of the element
     *
     * @alpha
     */
    get validity() {
      return this.elementInternals ? this.elementInternals.validity : this.proxy.validity;
    }
    /**
     * Retrieve a reference to the associated form.
     * Returns null if not associated to any form.
     *
     * @alpha
     */
    get form() {
      return this.elementInternals ? this.elementInternals.form : this.proxy.form;
    }
    /**
     * Retrieve the localized validation message,
     * or custom validation message if set.
     *
     * @alpha
     */
    get validationMessage() {
      return this.elementInternals ? this.elementInternals.validationMessage : this.proxy.validationMessage;
    }
    /**
     * Whether the element will be validated when the
     * form is submitted
     */
    get willValidate() {
      return this.elementInternals ? this.elementInternals.willValidate : this.proxy.willValidate;
    }
    /**
     * A reference to all associated label elements
     */
    get labels() {
      if (this.elementInternals) {
        return Object.freeze(Array.from(this.elementInternals.labels));
      } else if (this.proxy instanceof HTMLElement && this.proxy.ownerDocument && this.id) {
        const parentLabels = this.proxy.labels;
        const forLabels = Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`));
        const labels = parentLabels ? forLabels.concat(Array.from(parentLabels)) : forLabels;
        return Object.freeze(labels);
      } else {
        return emptyArray;
      }
    }
    /**
     * Invoked when the `value` property changes
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `valueChanged` method
     * They must be sure to invoke `super.valueChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    valueChanged(previous, next) {
      this.dirtyValue = true;
      if (this.proxy instanceof HTMLElement) {
        this.proxy.value = this.value;
      }
      this.currentValue = this.value;
      this.setFormValue(this.value);
      this.validate();
    }
    currentValueChanged() {
      this.value = this.currentValue;
    }
    /**
     * Invoked when the `initialValue` property changes
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `initialValueChanged` method
     * They must be sure to invoke `super.initialValueChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    initialValueChanged(previous, next) {
      if (!this.dirtyValue) {
        this.value = this.initialValue;
        this.dirtyValue = false;
      }
    }
    /**
     * Invoked when the `disabled` property changes
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `disabledChanged` method
     * They must be sure to invoke `super.disabledChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    disabledChanged(previous, next) {
      if (this.proxy instanceof HTMLElement) {
        this.proxy.disabled = this.disabled;
      }
      DOM.queueUpdate(() => this.classList.toggle("disabled", this.disabled));
    }
    /**
     * Invoked when the `name` property changes
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `nameChanged` method
     * They must be sure to invoke `super.nameChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    nameChanged(previous, next) {
      if (this.proxy instanceof HTMLElement) {
        this.proxy.name = this.name;
      }
    }
    /**
     * Invoked when the `required` property changes
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `requiredChanged` method
     * They must be sure to invoke `super.requiredChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    requiredChanged(prev, next) {
      if (this.proxy instanceof HTMLElement) {
        this.proxy.required = this.required;
      }
      DOM.queueUpdate(() => this.classList.toggle("required", this.required));
      this.validate();
    }
    /**
     * The element internals object. Will only exist
     * in browsers supporting the attachInternals API
     */
    get elementInternals() {
      if (!supportsElementInternals) {
        return null;
      }
      let internals = InternalsMap.get(this);
      if (!internals) {
        internals = this.attachInternals();
        InternalsMap.set(this, internals);
      }
      return internals;
    }
    /**
     * @internal
     */
    connectedCallback() {
      super.connectedCallback();
      this.addEventListener("keypress", this._keypressHandler);
      if (!this.value) {
        this.value = this.initialValue;
        this.dirtyValue = false;
      }
      if (!this.elementInternals) {
        this.attachProxy();
        if (this.form) {
          this.form.addEventListener("reset", this.formResetCallback);
        }
      }
    }
    /**
     * @internal
     */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.proxyEventsToBlock.forEach((name) => this.proxy.removeEventListener(name, this.stopPropagation));
      if (!this.elementInternals && this.form) {
        this.form.removeEventListener("reset", this.formResetCallback);
      }
    }
    /**
     * Return the current validity of the element.
     */
    checkValidity() {
      return this.elementInternals ? this.elementInternals.checkValidity() : this.proxy.checkValidity();
    }
    /**
     * Return the current validity of the element.
     * If false, fires an invalid event at the element.
     */
    reportValidity() {
      return this.elementInternals ? this.elementInternals.reportValidity() : this.proxy.reportValidity();
    }
    /**
     * Set the validity of the control. In cases when the elementInternals object is not
     * available (and the proxy element is used to report validity), this function will
     * do nothing unless a message is provided, at which point the setCustomValidity method
     * of the proxy element will be invoked with the provided message.
     * @param flags - Validity flags
     * @param message - Optional message to supply
     * @param anchor - Optional element used by UA to display an interactive validation UI
     */
    setValidity(flags, message, anchor) {
      if (this.elementInternals) {
        this.elementInternals.setValidity(flags, message, anchor);
      } else if (typeof message === "string") {
        this.proxy.setCustomValidity(message);
      }
    }
    /**
     * Invoked when a connected component's form or fieldset has its disabled
     * state changed.
     * @param disabled - the disabled value of the form / fieldset
     */
    formDisabledCallback(disabled) {
      this.disabled = disabled;
    }
    formResetCallback() {
      this.value = this.initialValue;
      this.dirtyValue = false;
    }
    /**
     * Attach the proxy element to the DOM
     */
    attachProxy() {
      var _a;
      if (!this.proxyInitialized) {
        this.proxyInitialized = true;
        this.proxy.style.display = "none";
        this.proxyEventsToBlock.forEach((name) => this.proxy.addEventListener(name, this.stopPropagation));
        this.proxy.disabled = this.disabled;
        this.proxy.required = this.required;
        if (typeof this.name === "string") {
          this.proxy.name = this.name;
        }
        if (typeof this.value === "string") {
          this.proxy.value = this.value;
        }
        this.proxy.setAttribute("slot", proxySlotName);
        this.proxySlot = document.createElement("slot");
        this.proxySlot.setAttribute("name", proxySlotName);
      }
      (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(this.proxySlot);
      this.appendChild(this.proxy);
    }
    /**
     * Detach the proxy element from the DOM
     */
    detachProxy() {
      var _a;
      this.removeChild(this.proxy);
      (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.removeChild(this.proxySlot);
    }
    /** {@inheritDoc (FormAssociated:interface).validate} */
    validate(anchor) {
      if (this.proxy instanceof HTMLElement) {
        this.setValidity(this.proxy.validity, this.proxy.validationMessage, anchor);
      }
    }
    /**
     * Associates the provided value (and optional state) with the parent form.
     * @param value - The value to set
     * @param state - The state object provided to during session restores and when autofilling.
     */
    setFormValue(value, state) {
      if (this.elementInternals) {
        this.elementInternals.setFormValue(value, state || value);
      }
    }
    _keypressHandler(e) {
      switch (e.key) {
        case keyEnter:
          if (this.form instanceof HTMLFormElement) {
            const defaultButton = this.form.querySelector("[type=submit]");
            defaultButton === null || defaultButton === void 0 ? void 0 : defaultButton.click();
          }
          break;
      }
    }
    /**
     * Used to stop propagation of proxy element events
     * @param e - Event object
     */
    stopPropagation(e) {
      e.stopPropagation();
    }
  };
  attr({ mode: "boolean" })(C.prototype, "disabled");
  attr({ mode: "fromView", attribute: "value" })(C.prototype, "initialValue");
  attr({ attribute: "current-value" })(C.prototype, "currentValue");
  attr(C.prototype, "name");
  attr({ mode: "boolean" })(C.prototype, "required");
  observable(C.prototype, "value");
  return C;
}
function CheckableFormAssociated(BaseCtor) {
  class C extends FormAssociated(BaseCtor) {
  }
  class D extends C {
    constructor(...args) {
      super(args);
      this.dirtyChecked = false;
      this.checkedAttribute = false;
      this.checked = false;
      this.dirtyChecked = false;
    }
    checkedAttributeChanged() {
      this.defaultChecked = this.checkedAttribute;
    }
    /**
     * @internal
     */
    defaultCheckedChanged() {
      if (!this.dirtyChecked) {
        this.checked = this.defaultChecked;
        this.dirtyChecked = false;
      }
    }
    checkedChanged(prev, next) {
      if (!this.dirtyChecked) {
        this.dirtyChecked = true;
      }
      this.currentChecked = this.checked;
      this.updateForm();
      if (this.proxy instanceof HTMLInputElement) {
        this.proxy.checked = this.checked;
      }
      if (prev !== void 0) {
        this.$emit("change");
      }
      this.validate();
    }
    currentCheckedChanged(prev, next) {
      this.checked = this.currentChecked;
    }
    updateForm() {
      const value = this.checked ? this.value : null;
      this.setFormValue(value, value);
    }
    connectedCallback() {
      super.connectedCallback();
      this.updateForm();
    }
    formResetCallback() {
      super.formResetCallback();
      this.checked = !!this.checkedAttribute;
      this.dirtyChecked = false;
    }
  }
  attr({ attribute: "checked", mode: "boolean" })(D.prototype, "checkedAttribute");
  attr({ attribute: "current-checked", converter: booleanConverter })(D.prototype, "currentChecked");
  observable(D.prototype, "defaultChecked");
  observable(D.prototype, "checked");
  return D;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/button/button.form-associated.js
var _Button = class extends FoundationElement {
};
var FormAssociatedButton = class extends FormAssociated(_Button) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/button/button.js
var Button = class extends FormAssociatedButton {
  constructor() {
    super(...arguments);
    this.handleClick = (e) => {
      var _a;
      if (this.disabled && ((_a = this.defaultSlottedContent) === null || _a === void 0 ? void 0 : _a.length) <= 1) {
        e.stopPropagation();
      }
    };
    this.handleSubmission = () => {
      if (!this.form) {
        return;
      }
      const attached = this.proxy.isConnected;
      if (!attached) {
        this.attachProxy();
      }
      typeof this.form.requestSubmit === "function" ? this.form.requestSubmit(this.proxy) : this.proxy.click();
      if (!attached) {
        this.detachProxy();
      }
    };
    this.handleFormReset = () => {
      var _a;
      (_a = this.form) === null || _a === void 0 ? void 0 : _a.reset();
    };
    this.handleUnsupportedDelegatesFocus = () => {
      var _a;
      if (window.ShadowRoot && !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") && ((_a = this.$fastController.definition.shadowOptions) === null || _a === void 0 ? void 0 : _a.delegatesFocus)) {
        this.focus = () => {
          this.control.focus();
        };
      }
    };
  }
  formactionChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.formAction = this.formaction;
    }
  }
  formenctypeChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.formEnctype = this.formenctype;
    }
  }
  formmethodChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.formMethod = this.formmethod;
    }
  }
  formnovalidateChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.formNoValidate = this.formnovalidate;
    }
  }
  formtargetChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.formTarget = this.formtarget;
    }
  }
  typeChanged(previous, next) {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.type = this.type;
    }
    next === "submit" && this.addEventListener("click", this.handleSubmission);
    previous === "submit" && this.removeEventListener("click", this.handleSubmission);
    next === "reset" && this.addEventListener("click", this.handleFormReset);
    previous === "reset" && this.removeEventListener("click", this.handleFormReset);
  }
  /** {@inheritDoc (FormAssociated:interface).validate} */
  validate() {
    super.validate(this.control);
  }
  /**
   * @internal
   */
  connectedCallback() {
    var _a;
    super.connectedCallback();
    this.proxy.setAttribute("type", this.type);
    this.handleUnsupportedDelegatesFocus();
    const elements2 = Array.from((_a = this.control) === null || _a === void 0 ? void 0 : _a.children);
    if (elements2) {
      elements2.forEach((span) => {
        span.addEventListener("click", this.handleClick);
      });
    }
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    var _a;
    super.disconnectedCallback();
    const elements2 = Array.from((_a = this.control) === null || _a === void 0 ? void 0 : _a.children);
    if (elements2) {
      elements2.forEach((span) => {
        span.removeEventListener("click", this.handleClick);
      });
    }
  }
};
__decorate([
  attr({ mode: "boolean" })
], Button.prototype, "autofocus", void 0);
__decorate([
  attr({ attribute: "form" })
], Button.prototype, "formId", void 0);
__decorate([
  attr
], Button.prototype, "formaction", void 0);
__decorate([
  attr
], Button.prototype, "formenctype", void 0);
__decorate([
  attr
], Button.prototype, "formmethod", void 0);
__decorate([
  attr({ mode: "boolean" })
], Button.prototype, "formnovalidate", void 0);
__decorate([
  attr
], Button.prototype, "formtarget", void 0);
__decorate([
  attr
], Button.prototype, "type", void 0);
__decorate([
  observable
], Button.prototype, "defaultSlottedContent", void 0);
var DelegatesARIAButton = class {
};
__decorate([
  attr({ attribute: "aria-expanded" })
], DelegatesARIAButton.prototype, "ariaExpanded", void 0);
__decorate([
  attr({ attribute: "aria-pressed" })
], DelegatesARIAButton.prototype, "ariaPressed", void 0);
applyMixins(DelegatesARIAButton, ARIAGlobalStatesAndProperties);
applyMixins(Button, StartEnd, DelegatesARIAButton);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/calendar/date-formatter.js
var DateFormatter = class {
  constructor(config) {
    this.dayFormat = "numeric";
    this.weekdayFormat = "long";
    this.monthFormat = "long";
    this.yearFormat = "numeric";
    this.date = /* @__PURE__ */ new Date();
    if (config) {
      for (const key in config) {
        const value = config[key];
        if (key === "date") {
          this.date = this.getDateObject(value);
        } else {
          this[key] = value;
        }
      }
    }
  }
  /**
   * Helper function to make sure that the DateFormatter is working with an instance of Date
   * @param date - The date as an object, string or Date insance
   * @returns - A Date instance
   * @public
   */
  getDateObject(date) {
    if (typeof date === "string") {
      const dates = date.split(/[/-]/);
      if (dates.length < 3) {
        return /* @__PURE__ */ new Date();
      }
      return new Date(parseInt(dates[2], 10), parseInt(dates[0], 10) - 1, parseInt(dates[1], 10));
    } else if ("day" in date && "month" in date && "year" in date) {
      const { day, month, year } = date;
      return new Date(year, month - 1, day);
    }
    return date;
  }
  /**
   *
   * @param date - a valide date as either a Date, string, objec or a DateFormatter
   * @param format - The formatting for the string
   * @param locale - locale data used for formatting
   * @returns A localized string of the date provided
   * @public
   */
  getDate(date = this.date, format = {
    weekday: this.weekdayFormat,
    month: this.monthFormat,
    day: this.dayFormat,
    year: this.yearFormat
  }, locale = this.locale) {
    const dateObj = this.getDateObject(date);
    if (!dateObj.getTime()) {
      return "";
    }
    const optionsWithTimeZone = Object.assign({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }, format);
    return new Intl.DateTimeFormat(locale, optionsWithTimeZone).format(dateObj);
  }
  /**
   *
   * @param day - Day to localize
   * @param format - The formatting for the day
   * @param locale - The locale data used for formatting
   * @returns - A localized number for the day
   * @public
   */
  getDay(day = this.date.getDate(), format = this.dayFormat, locale = this.locale) {
    return this.getDate({ month: 1, day, year: 2020 }, { day: format }, locale);
  }
  /**
   *
   * @param month - The month to localize
   * @param format - The formatting for the month
   * @param locale - The locale data used for formatting
   * @returns - A localized name of the month
   * @public
   */
  getMonth(month = this.date.getMonth() + 1, format = this.monthFormat, locale = this.locale) {
    return this.getDate({ month, day: 2, year: 2020 }, { month: format }, locale);
  }
  /**
   *
   * @param year - The year to localize
   * @param format - The formatting for the year
   * @param locale - The locale data used for formatting
   * @returns - A localized string for the year
   * @public
   */
  getYear(year = this.date.getFullYear(), format = this.yearFormat, locale = this.locale) {
    return this.getDate({ month: 2, day: 2, year }, { year: format }, locale);
  }
  /**
   *
   * @param weekday - The number of the weekday, defaults to Sunday
   * @param format - The formatting for the weekday label
   * @param locale - The locale data used for formatting
   * @returns - A formatted weekday label
   * @public
   */
  getWeekday(weekday = 0, format = this.weekdayFormat, locale = this.locale) {
    const date = `1-${weekday + 1}-2017`;
    return this.getDate(date, { weekday: format }, locale);
  }
  /**
   *
   * @param format - The formatting for the weekdays
   * @param locale - The locale data used for formatting
   * @returns - An array of the weekday labels
   * @public
   */
  getWeekdays(format = this.weekdayFormat, locale = this.locale) {
    return Array(7).fill(null).map((_, day) => this.getWeekday(day, format, locale));
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/calendar/calendar.js
var Calendar = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.dateFormatter = new DateFormatter();
    this.readonly = false;
    this.locale = "en-US";
    this.month = (/* @__PURE__ */ new Date()).getMonth() + 1;
    this.year = (/* @__PURE__ */ new Date()).getFullYear();
    this.dayFormat = "numeric";
    this.weekdayFormat = "short";
    this.monthFormat = "long";
    this.yearFormat = "numeric";
    this.minWeeks = 0;
    this.disabledDates = "";
    this.selectedDates = "";
    this.oneDayInMs = 864e5;
  }
  localeChanged() {
    this.dateFormatter.locale = this.locale;
  }
  dayFormatChanged() {
    this.dateFormatter.dayFormat = this.dayFormat;
  }
  weekdayFormatChanged() {
    this.dateFormatter.weekdayFormat = this.weekdayFormat;
  }
  monthFormatChanged() {
    this.dateFormatter.monthFormat = this.monthFormat;
  }
  yearFormatChanged() {
    this.dateFormatter.yearFormat = this.yearFormat;
  }
  /**
   * Gets data needed to render about a calendar month as well as the previous and next months
   * @param year - year of the calendar
   * @param month - month of the calendar
   * @returns - an object with data about the current and 2 surrounding months
   * @public
   */
  getMonthInfo(month = this.month, year = this.year) {
    const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const getLength = (date) => {
      const nextMonth2 = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      return new Date(nextMonth2.getTime() - this.oneDayInMs).getDate();
    };
    const thisMonth = new Date(year, month - 1);
    const nextMonth = new Date(year, month);
    const previousMonth = new Date(year, month - 2);
    return {
      length: getLength(thisMonth),
      month,
      start: getFirstDay(thisMonth),
      year,
      previous: {
        length: getLength(previousMonth),
        month: previousMonth.getMonth() + 1,
        start: getFirstDay(previousMonth),
        year: previousMonth.getFullYear()
      },
      next: {
        length: getLength(nextMonth),
        month: nextMonth.getMonth() + 1,
        start: getFirstDay(nextMonth),
        year: nextMonth.getFullYear()
      }
    };
  }
  /**
   * A list of calendar days
   * @param info - an object containing the information needed to render a calendar month
   * @param minWeeks - minimum number of weeks to show
   * @returns a list of days in a calendar month
   * @public
   */
  getDays(info = this.getMonthInfo(), minWeeks = this.minWeeks) {
    minWeeks = minWeeks > 10 ? 10 : minWeeks;
    const { start, length, previous, next } = info;
    const days = [];
    let dayCount = 1 - start;
    while (dayCount < length + 1 || days.length < minWeeks || days[days.length - 1].length % 7 !== 0) {
      const { month, year } = dayCount < 1 ? previous : dayCount > length ? next : info;
      const day = dayCount < 1 ? previous.length + dayCount : dayCount > length ? dayCount - length : dayCount;
      const dateString = `${month}-${day}-${year}`;
      const disabled = this.dateInString(dateString, this.disabledDates);
      const selected = this.dateInString(dateString, this.selectedDates);
      const date = {
        day,
        month,
        year,
        disabled,
        selected
      };
      const target2 = days[days.length - 1];
      if (days.length === 0 || target2.length % 7 === 0) {
        days.push([date]);
      } else {
        target2.push(date);
      }
      dayCount++;
    }
    return days;
  }
  /**
   * A helper function that checks if a date exists in a list of dates
   * @param date - A date objec that includes the day, month and year
   * @param datesString - a comma separated list of dates
   * @returns - Returns true if it found the date in the list of dates
   * @public
   */
  dateInString(date, datesString) {
    const dates = datesString.split(",").map((str) => str.trim());
    date = typeof date === "string" ? date : `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    return dates.some((d2) => d2 === date);
  }
  /**
   * Creates a class string for the day container
   * @param date - date of the calendar cell
   * @returns - string of class names
   * @public
   */
  getDayClassNames(date, todayString) {
    const { day, month, year, disabled, selected } = date;
    const today = todayString === `${month}-${day}-${year}`;
    const inactive = this.month !== month;
    return [
      "day",
      today && "today",
      inactive && "inactive",
      disabled && "disabled",
      selected && "selected"
    ].filter(Boolean).join(" ");
  }
  /**
   * Returns a list of weekday labels
   * @returns An array of weekday text and full text if abbreviated
   * @public
   */
  getWeekdayText() {
    const weekdayText = this.dateFormatter.getWeekdays().map((text) => ({ text }));
    if (this.weekdayFormat !== "long") {
      const longText = this.dateFormatter.getWeekdays("long");
      weekdayText.forEach((weekday, index) => {
        weekday.abbr = longText[index];
      });
    }
    return weekdayText;
  }
  /**
   * Emits the "date-select" event with the day, month and year.
   * @param date - Date cell
   * @public
   */
  handleDateSelect(event, day) {
    event.preventDefault;
    this.$emit("dateselected", day);
  }
  /**
   * Handles keyboard events on a cell
   * @param event - Keyboard event
   * @param date - Date of the cell selected
   */
  handleKeydown(event, date) {
    if (event.key === keyEnter) {
      this.handleDateSelect(event, date);
    }
    return true;
  }
};
__decorate([
  attr({ mode: "boolean" })
], Calendar.prototype, "readonly", void 0);
__decorate([
  attr
], Calendar.prototype, "locale", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Calendar.prototype, "month", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Calendar.prototype, "year", void 0);
__decorate([
  attr({ attribute: "day-format", mode: "fromView" })
], Calendar.prototype, "dayFormat", void 0);
__decorate([
  attr({ attribute: "weekday-format", mode: "fromView" })
], Calendar.prototype, "weekdayFormat", void 0);
__decorate([
  attr({ attribute: "month-format", mode: "fromView" })
], Calendar.prototype, "monthFormat", void 0);
__decorate([
  attr({ attribute: "year-format", mode: "fromView" })
], Calendar.prototype, "yearFormat", void 0);
__decorate([
  attr({ attribute: "min-weeks", converter: nullableNumberConverter })
], Calendar.prototype, "minWeeks", void 0);
__decorate([
  attr({ attribute: "disabled-dates" })
], Calendar.prototype, "disabledDates", void 0);
__decorate([
  attr({ attribute: "selected-dates" })
], Calendar.prototype, "selectedDates", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/data-grid/data-grid.options.js
var GenerateHeaderOptions = {
  none: "none",
  default: "default",
  sticky: "sticky"
};
var DataGridCellTypes = {
  default: "default",
  columnHeader: "columnheader",
  rowHeader: "rowheader"
};
var DataGridRowTypes = {
  default: "default",
  header: "header",
  stickyHeader: "sticky-header"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/data-grid/data-grid-row.js
var DataGridRow = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.rowType = DataGridRowTypes.default;
    this.rowData = null;
    this.columnDefinitions = null;
    this.isActiveRow = false;
    this.cellsRepeatBehavior = null;
    this.cellsPlaceholder = null;
    this.focusColumnIndex = 0;
    this.refocusOnLoad = false;
    this.updateRowStyle = () => {
      this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
  }
  gridTemplateColumnsChanged() {
    if (this.$fastController.isConnected) {
      this.updateRowStyle();
    }
  }
  rowTypeChanged() {
    if (this.$fastController.isConnected) {
      this.updateItemTemplate();
    }
  }
  rowDataChanged() {
    if (this.rowData !== null && this.isActiveRow) {
      this.refocusOnLoad = true;
      return;
    }
  }
  cellItemTemplateChanged() {
    this.updateItemTemplate();
  }
  headerCellItemTemplateChanged() {
    this.updateItemTemplate();
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.cellsRepeatBehavior === null) {
      this.cellsPlaceholder = document.createComment("");
      this.appendChild(this.cellsPlaceholder);
      this.updateItemTemplate();
      this.cellsRepeatBehavior = new RepeatDirective((x) => x.columnDefinitions, (x) => x.activeCellItemTemplate, { positioning: true }).createBehavior(this.cellsPlaceholder);
      this.$fastController.addBehaviors([this.cellsRepeatBehavior]);
    }
    this.addEventListener("cell-focused", this.handleCellFocus);
    this.addEventListener(eventFocusOut, this.handleFocusout);
    this.addEventListener(eventKeyDown, this.handleKeydown);
    this.updateRowStyle();
    if (this.refocusOnLoad) {
      this.refocusOnLoad = false;
      if (this.cellElements.length > this.focusColumnIndex) {
        this.cellElements[this.focusColumnIndex].focus();
      }
    }
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("cell-focused", this.handleCellFocus);
    this.removeEventListener(eventFocusOut, this.handleFocusout);
    this.removeEventListener(eventKeyDown, this.handleKeydown);
  }
  handleFocusout(e) {
    if (!this.contains(e.target)) {
      this.isActiveRow = false;
      this.focusColumnIndex = 0;
    }
  }
  handleCellFocus(e) {
    this.isActiveRow = true;
    this.focusColumnIndex = this.cellElements.indexOf(e.target);
    this.$emit("row-focused", this);
  }
  handleKeydown(e) {
    if (e.defaultPrevented) {
      return;
    }
    let newFocusColumnIndex = 0;
    switch (e.key) {
      case keyArrowLeft:
        newFocusColumnIndex = Math.max(0, this.focusColumnIndex - 1);
        this.cellElements[newFocusColumnIndex].focus();
        e.preventDefault();
        break;
      case keyArrowRight:
        newFocusColumnIndex = Math.min(this.cellElements.length - 1, this.focusColumnIndex + 1);
        this.cellElements[newFocusColumnIndex].focus();
        e.preventDefault();
        break;
      case keyHome:
        if (!e.ctrlKey) {
          this.cellElements[0].focus();
          e.preventDefault();
        }
        break;
      case keyEnd:
        if (!e.ctrlKey) {
          this.cellElements[this.cellElements.length - 1].focus();
          e.preventDefault();
        }
        break;
    }
  }
  updateItemTemplate() {
    this.activeCellItemTemplate = this.rowType === DataGridRowTypes.default && this.cellItemTemplate !== void 0 ? this.cellItemTemplate : this.rowType === DataGridRowTypes.default && this.cellItemTemplate === void 0 ? this.defaultCellItemTemplate : this.headerCellItemTemplate !== void 0 ? this.headerCellItemTemplate : this.defaultHeaderCellItemTemplate;
  }
};
__decorate([
  attr({ attribute: "grid-template-columns" })
], DataGridRow.prototype, "gridTemplateColumns", void 0);
__decorate([
  attr({ attribute: "row-type" })
], DataGridRow.prototype, "rowType", void 0);
__decorate([
  observable
], DataGridRow.prototype, "rowData", void 0);
__decorate([
  observable
], DataGridRow.prototype, "columnDefinitions", void 0);
__decorate([
  observable
], DataGridRow.prototype, "cellItemTemplate", void 0);
__decorate([
  observable
], DataGridRow.prototype, "headerCellItemTemplate", void 0);
__decorate([
  observable
], DataGridRow.prototype, "rowIndex", void 0);
__decorate([
  observable
], DataGridRow.prototype, "isActiveRow", void 0);
__decorate([
  observable
], DataGridRow.prototype, "activeCellItemTemplate", void 0);
__decorate([
  observable
], DataGridRow.prototype, "defaultCellItemTemplate", void 0);
__decorate([
  observable
], DataGridRow.prototype, "defaultHeaderCellItemTemplate", void 0);
__decorate([
  observable
], DataGridRow.prototype, "cellElements", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/data-grid/data-grid.template.js
function createRowItemTemplate(context) {
  const rowTag = context.tagFor(DataGridRow);
  return html2`
    <${rowTag}
        :rowData="${(x) => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></${rowTag}>
`;
}
var dataGridTemplate = (context, definition) => {
  const rowItemTemplate = createRowItemTemplate(context);
  const rowTag = context.tagFor(DataGridRow);
  return html2`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${() => rowTag}"
            :defaultRowItemTemplate="${rowItemTemplate}"
            ${children({
    property: "rowElements",
    filter: elements("[role=row]")
  })}
        >
            <slot></slot>
        </template>
    `;
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/data-grid/data-grid.js
var DataGrid = class _DataGrid extends FoundationElement {
  constructor() {
    super();
    this.noTabbing = false;
    this.generateHeader = GenerateHeaderOptions.default;
    this.rowsData = [];
    this.columnDefinitions = null;
    this.focusRowIndex = 0;
    this.focusColumnIndex = 0;
    this.rowsPlaceholder = null;
    this.generatedHeader = null;
    this.isUpdatingFocus = false;
    this.pendingFocusUpdate = false;
    this.rowindexUpdateQueued = false;
    this.columnDefinitionsStale = true;
    this.generatedGridTemplateColumns = "";
    this.focusOnCell = (rowIndex, columnIndex, scrollIntoView) => {
      if (this.rowElements.length === 0) {
        this.focusRowIndex = 0;
        this.focusColumnIndex = 0;
        return;
      }
      const focusRowIndex = Math.max(0, Math.min(this.rowElements.length - 1, rowIndex));
      const focusRow = this.rowElements[focusRowIndex];
      const cells = focusRow.querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]');
      const focusColumnIndex = Math.max(0, Math.min(cells.length - 1, columnIndex));
      const focusTarget = cells[focusColumnIndex];
      if (scrollIntoView && this.scrollHeight !== this.clientHeight && (focusRowIndex < this.focusRowIndex && this.scrollTop > 0 || focusRowIndex > this.focusRowIndex && this.scrollTop < this.scrollHeight - this.clientHeight)) {
        focusTarget.scrollIntoView({ block: "center", inline: "center" });
      }
      focusTarget.focus();
    };
    this.onChildListChange = (mutations, observer2) => {
      if (mutations && mutations.length) {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((newNode) => {
            if (newNode.nodeType === 1 && newNode.getAttribute("role") === "row") {
              newNode.columnDefinitions = this.columnDefinitions;
            }
          });
        });
        this.queueRowIndexUpdate();
      }
    };
    this.queueRowIndexUpdate = () => {
      if (!this.rowindexUpdateQueued) {
        this.rowindexUpdateQueued = true;
        DOM.queueUpdate(this.updateRowIndexes);
      }
    };
    this.updateRowIndexes = () => {
      let newGridTemplateColumns = this.gridTemplateColumns;
      if (newGridTemplateColumns === void 0) {
        if (this.generatedGridTemplateColumns === "" && this.rowElements.length > 0) {
          const firstRow = this.rowElements[0];
          this.generatedGridTemplateColumns = new Array(firstRow.cellElements.length).fill("1fr").join(" ");
        }
        newGridTemplateColumns = this.generatedGridTemplateColumns;
      }
      this.rowElements.forEach((element, index) => {
        const thisRow = element;
        thisRow.rowIndex = index;
        thisRow.gridTemplateColumns = newGridTemplateColumns;
        if (this.columnDefinitionsStale) {
          thisRow.columnDefinitions = this.columnDefinitions;
        }
      });
      this.rowindexUpdateQueued = false;
      this.columnDefinitionsStale = false;
    };
  }
  /**
   *  generates a gridTemplateColumns based on columndata array
   */
  static generateTemplateColumns(columnDefinitions) {
    let templateColumns = "";
    columnDefinitions.forEach((column) => {
      templateColumns = `${templateColumns}${templateColumns === "" ? "" : " "}${"1fr"}`;
    });
    return templateColumns;
  }
  noTabbingChanged() {
    if (this.$fastController.isConnected) {
      if (this.noTabbing) {
        this.setAttribute("tabIndex", "-1");
      } else {
        this.setAttribute("tabIndex", this.contains(document.activeElement) || this === document.activeElement ? "-1" : "0");
      }
    }
  }
  generateHeaderChanged() {
    if (this.$fastController.isConnected) {
      this.toggleGeneratedHeader();
    }
  }
  gridTemplateColumnsChanged() {
    if (this.$fastController.isConnected) {
      this.updateRowIndexes();
    }
  }
  rowsDataChanged() {
    if (this.columnDefinitions === null && this.rowsData.length > 0) {
      this.columnDefinitions = _DataGrid.generateColumns(this.rowsData[0]);
    }
    if (this.$fastController.isConnected) {
      this.toggleGeneratedHeader();
    }
  }
  columnDefinitionsChanged() {
    if (this.columnDefinitions === null) {
      this.generatedGridTemplateColumns = "";
      return;
    }
    this.generatedGridTemplateColumns = _DataGrid.generateTemplateColumns(this.columnDefinitions);
    if (this.$fastController.isConnected) {
      this.columnDefinitionsStale = true;
      this.queueRowIndexUpdate();
    }
  }
  headerCellItemTemplateChanged() {
    if (this.$fastController.isConnected) {
      if (this.generatedHeader !== null) {
        this.generatedHeader.headerCellItemTemplate = this.headerCellItemTemplate;
      }
    }
  }
  focusRowIndexChanged() {
    if (this.$fastController.isConnected) {
      this.queueFocusUpdate();
    }
  }
  focusColumnIndexChanged() {
    if (this.$fastController.isConnected) {
      this.queueFocusUpdate();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.rowItemTemplate === void 0) {
      this.rowItemTemplate = this.defaultRowItemTemplate;
    }
    this.rowsPlaceholder = document.createComment("");
    this.appendChild(this.rowsPlaceholder);
    this.toggleGeneratedHeader();
    this.rowsRepeatBehavior = new RepeatDirective((x) => x.rowsData, (x) => x.rowItemTemplate, { positioning: true }).createBehavior(this.rowsPlaceholder);
    this.$fastController.addBehaviors([this.rowsRepeatBehavior]);
    this.addEventListener("row-focused", this.handleRowFocus);
    this.addEventListener(eventFocus, this.handleFocus);
    this.addEventListener(eventKeyDown, this.handleKeydown);
    this.addEventListener(eventFocusOut, this.handleFocusOut);
    this.observer = new MutationObserver(this.onChildListChange);
    this.observer.observe(this, { childList: true });
    if (this.noTabbing) {
      this.setAttribute("tabindex", "-1");
    }
    DOM.queueUpdate(this.queueRowIndexUpdate);
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("row-focused", this.handleRowFocus);
    this.removeEventListener(eventFocus, this.handleFocus);
    this.removeEventListener(eventKeyDown, this.handleKeydown);
    this.removeEventListener(eventFocusOut, this.handleFocusOut);
    this.observer.disconnect();
    this.rowsPlaceholder = null;
    this.generatedHeader = null;
  }
  /**
   * @internal
   */
  handleRowFocus(e) {
    this.isUpdatingFocus = true;
    const focusRow = e.target;
    this.focusRowIndex = this.rowElements.indexOf(focusRow);
    this.focusColumnIndex = focusRow.focusColumnIndex;
    this.setAttribute("tabIndex", "-1");
    this.isUpdatingFocus = false;
  }
  /**
   * @internal
   */
  handleFocus(e) {
    this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
  }
  /**
   * @internal
   */
  handleFocusOut(e) {
    if (e.relatedTarget === null || !this.contains(e.relatedTarget)) {
      this.setAttribute("tabIndex", this.noTabbing ? "-1" : "0");
    }
  }
  /**
   * @internal
   */
  handleKeydown(e) {
    if (e.defaultPrevented) {
      return;
    }
    let newFocusRowIndex;
    const maxIndex = this.rowElements.length - 1;
    const currentGridBottom = this.offsetHeight + this.scrollTop;
    const lastRow = this.rowElements[maxIndex];
    switch (e.key) {
      case keyArrowUp:
        e.preventDefault();
        this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex, true);
        break;
      case keyArrowDown:
        e.preventDefault();
        this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex, true);
        break;
      case keyPageUp:
        e.preventDefault();
        if (this.rowElements.length === 0) {
          this.focusOnCell(0, 0, false);
          break;
        }
        if (this.focusRowIndex === 0) {
          this.focusOnCell(0, this.focusColumnIndex, false);
          return;
        }
        newFocusRowIndex = this.focusRowIndex - 1;
        for (newFocusRowIndex; newFocusRowIndex >= 0; newFocusRowIndex--) {
          const thisRow = this.rowElements[newFocusRowIndex];
          if (thisRow.offsetTop < this.scrollTop) {
            this.scrollTop = thisRow.offsetTop + thisRow.clientHeight - this.clientHeight;
            break;
          }
        }
        this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, false);
        break;
      case keyPageDown:
        e.preventDefault();
        if (this.rowElements.length === 0) {
          this.focusOnCell(0, 0, false);
          break;
        }
        if (this.focusRowIndex >= maxIndex || lastRow.offsetTop + lastRow.offsetHeight <= currentGridBottom) {
          this.focusOnCell(maxIndex, this.focusColumnIndex, false);
          return;
        }
        newFocusRowIndex = this.focusRowIndex + 1;
        for (newFocusRowIndex; newFocusRowIndex <= maxIndex; newFocusRowIndex++) {
          const thisRow = this.rowElements[newFocusRowIndex];
          if (thisRow.offsetTop + thisRow.offsetHeight > currentGridBottom) {
            let stickyHeaderOffset = 0;
            if (this.generateHeader === GenerateHeaderOptions.sticky && this.generatedHeader !== null) {
              stickyHeaderOffset = this.generatedHeader.clientHeight;
            }
            this.scrollTop = thisRow.offsetTop - stickyHeaderOffset;
            break;
          }
        }
        this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, false);
        break;
      case keyHome:
        if (e.ctrlKey) {
          e.preventDefault();
          this.focusOnCell(0, 0, true);
        }
        break;
      case keyEnd:
        if (e.ctrlKey && this.columnDefinitions !== null) {
          e.preventDefault();
          this.focusOnCell(this.rowElements.length - 1, this.columnDefinitions.length - 1, true);
        }
        break;
    }
  }
  queueFocusUpdate() {
    if (this.isUpdatingFocus && (this.contains(document.activeElement) || this === document.activeElement)) {
      return;
    }
    if (this.pendingFocusUpdate === false) {
      this.pendingFocusUpdate = true;
      DOM.queueUpdate(() => this.updateFocus());
    }
  }
  updateFocus() {
    this.pendingFocusUpdate = false;
    this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
  }
  toggleGeneratedHeader() {
    if (this.generatedHeader !== null) {
      this.removeChild(this.generatedHeader);
      this.generatedHeader = null;
    }
    if (this.generateHeader !== GenerateHeaderOptions.none && this.rowsData.length > 0) {
      const generatedHeaderElement = document.createElement(this.rowElementTag);
      this.generatedHeader = generatedHeaderElement;
      this.generatedHeader.columnDefinitions = this.columnDefinitions;
      this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns;
      this.generatedHeader.rowType = this.generateHeader === GenerateHeaderOptions.sticky ? DataGridRowTypes.stickyHeader : DataGridRowTypes.header;
      if (this.firstChild !== null || this.rowsPlaceholder !== null) {
        this.insertBefore(generatedHeaderElement, this.firstChild !== null ? this.firstChild : this.rowsPlaceholder);
      }
      return;
    }
  }
};
DataGrid.generateColumns = (row) => {
  return Object.getOwnPropertyNames(row).map((property2, index) => {
    return {
      columnDataKey: property2,
      gridColumn: `${index}`
    };
  });
};
__decorate([
  attr({ attribute: "no-tabbing", mode: "boolean" })
], DataGrid.prototype, "noTabbing", void 0);
__decorate([
  attr({ attribute: "generate-header" })
], DataGrid.prototype, "generateHeader", void 0);
__decorate([
  attr({ attribute: "grid-template-columns" })
], DataGrid.prototype, "gridTemplateColumns", void 0);
__decorate([
  observable
], DataGrid.prototype, "rowsData", void 0);
__decorate([
  observable
], DataGrid.prototype, "columnDefinitions", void 0);
__decorate([
  observable
], DataGrid.prototype, "rowItemTemplate", void 0);
__decorate([
  observable
], DataGrid.prototype, "cellItemTemplate", void 0);
__decorate([
  observable
], DataGrid.prototype, "headerCellItemTemplate", void 0);
__decorate([
  observable
], DataGrid.prototype, "focusRowIndex", void 0);
__decorate([
  observable
], DataGrid.prototype, "focusColumnIndex", void 0);
__decorate([
  observable
], DataGrid.prototype, "defaultRowItemTemplate", void 0);
__decorate([
  observable
], DataGrid.prototype, "rowElementTag", void 0);
__decorate([
  observable
], DataGrid.prototype, "rowElements", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/data-grid/data-grid-cell.js
var defaultCellContentsTemplate = html2`
    <template>
        ${(x) => x.rowData === null || x.columnDefinition === null || x.columnDefinition.columnDataKey === null ? null : x.rowData[x.columnDefinition.columnDataKey]}
    </template>
`;
var defaultHeaderCellContentsTemplate = html2`
    <template>
        ${(x) => x.columnDefinition === null ? null : x.columnDefinition.title === void 0 ? x.columnDefinition.columnDataKey : x.columnDefinition.title}
    </template>
`;
var DataGridCell = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.cellType = DataGridCellTypes.default;
    this.rowData = null;
    this.columnDefinition = null;
    this.isActiveCell = false;
    this.customCellView = null;
    this.updateCellStyle = () => {
      this.style.gridColumn = this.gridColumn;
    };
  }
  cellTypeChanged() {
    if (this.$fastController.isConnected) {
      this.updateCellView();
    }
  }
  gridColumnChanged() {
    if (this.$fastController.isConnected) {
      this.updateCellStyle();
    }
  }
  columnDefinitionChanged(oldValue, newValue) {
    if (this.$fastController.isConnected) {
      this.updateCellView();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    var _a;
    super.connectedCallback();
    this.addEventListener(eventFocusIn, this.handleFocusin);
    this.addEventListener(eventFocusOut, this.handleFocusout);
    this.addEventListener(eventKeyDown, this.handleKeydown);
    this.style.gridColumn = `${((_a = this.columnDefinition) === null || _a === void 0 ? void 0 : _a.gridColumn) === void 0 ? 0 : this.columnDefinition.gridColumn}`;
    this.updateCellView();
    this.updateCellStyle();
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(eventFocusIn, this.handleFocusin);
    this.removeEventListener(eventFocusOut, this.handleFocusout);
    this.removeEventListener(eventKeyDown, this.handleKeydown);
    this.disconnectCellView();
  }
  handleFocusin(e) {
    if (this.isActiveCell) {
      return;
    }
    this.isActiveCell = true;
    switch (this.cellType) {
      case DataGridCellTypes.columnHeader:
        if (this.columnDefinition !== null && this.columnDefinition.headerCellInternalFocusQueue !== true && typeof this.columnDefinition.headerCellFocusTargetCallback === "function") {
          const focusTarget = this.columnDefinition.headerCellFocusTargetCallback(this);
          if (focusTarget !== null) {
            focusTarget.focus();
          }
        }
        break;
      default:
        if (this.columnDefinition !== null && this.columnDefinition.cellInternalFocusQueue !== true && typeof this.columnDefinition.cellFocusTargetCallback === "function") {
          const focusTarget = this.columnDefinition.cellFocusTargetCallback(this);
          if (focusTarget !== null) {
            focusTarget.focus();
          }
        }
        break;
    }
    this.$emit("cell-focused", this);
  }
  handleFocusout(e) {
    if (this !== document.activeElement && !this.contains(document.activeElement)) {
      this.isActiveCell = false;
    }
  }
  handleKeydown(e) {
    if (e.defaultPrevented || this.columnDefinition === null || this.cellType === DataGridCellTypes.default && this.columnDefinition.cellInternalFocusQueue !== true || this.cellType === DataGridCellTypes.columnHeader && this.columnDefinition.headerCellInternalFocusQueue !== true) {
      return;
    }
    switch (e.key) {
      case keyEnter:
      case keyFunction2:
        if (this.contains(document.activeElement) && document.activeElement !== this) {
          return;
        }
        switch (this.cellType) {
          case DataGridCellTypes.columnHeader:
            if (this.columnDefinition.headerCellFocusTargetCallback !== void 0) {
              const focusTarget = this.columnDefinition.headerCellFocusTargetCallback(this);
              if (focusTarget !== null) {
                focusTarget.focus();
              }
              e.preventDefault();
            }
            break;
          default:
            if (this.columnDefinition.cellFocusTargetCallback !== void 0) {
              const focusTarget = this.columnDefinition.cellFocusTargetCallback(this);
              if (focusTarget !== null) {
                focusTarget.focus();
              }
              e.preventDefault();
            }
            break;
        }
        break;
      case keyEscape:
        if (this.contains(document.activeElement) && document.activeElement !== this) {
          this.focus();
          e.preventDefault();
        }
        break;
    }
  }
  updateCellView() {
    this.disconnectCellView();
    if (this.columnDefinition === null) {
      return;
    }
    switch (this.cellType) {
      case DataGridCellTypes.columnHeader:
        if (this.columnDefinition.headerCellTemplate !== void 0) {
          this.customCellView = this.columnDefinition.headerCellTemplate.render(this, this);
        } else {
          this.customCellView = defaultHeaderCellContentsTemplate.render(this, this);
        }
        break;
      case void 0:
      case DataGridCellTypes.rowHeader:
      case DataGridCellTypes.default:
        if (this.columnDefinition.cellTemplate !== void 0) {
          this.customCellView = this.columnDefinition.cellTemplate.render(this, this);
        } else {
          this.customCellView = defaultCellContentsTemplate.render(this, this);
        }
        break;
    }
  }
  disconnectCellView() {
    if (this.customCellView !== null) {
      this.customCellView.dispose();
      this.customCellView = null;
    }
  }
};
__decorate([
  attr({ attribute: "cell-type" })
], DataGridCell.prototype, "cellType", void 0);
__decorate([
  attr({ attribute: "grid-column" })
], DataGridCell.prototype, "gridColumn", void 0);
__decorate([
  observable
], DataGridCell.prototype, "rowData", void 0);
__decorate([
  observable
], DataGridCell.prototype, "columnDefinition", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/data-grid/data-grid-row.template.js
function createCellItemTemplate(context) {
  const cellTag = context.tagFor(DataGridCell);
  return html2`
    <${cellTag}
        cell-type="${(x) => x.isRowHeader ? "rowheader" : void 0}"
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${(x) => x}"
    ></${cellTag}>
`;
}
function createHeaderCellItemTemplate(context) {
  const cellTag = context.tagFor(DataGridCell);
  return html2`
    <${cellTag}
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${(x) => x}"
    ></${cellTag}>
`;
}
var dataGridRowTemplate = (context, definition) => {
  const cellItemTemplate = createCellItemTemplate(context);
  const headerCellItemTemplate = createHeaderCellItemTemplate(context);
  return html2`
        <template
            role="row"
            class="${(x) => x.rowType !== "default" ? x.rowType : ""}"
            :defaultCellItemTemplate="${cellItemTemplate}"
            :defaultHeaderCellItemTemplate="${headerCellItemTemplate}"
            ${children({
    property: "cellElements",
    filter: elements('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')
  })}
        >
            <slot ${slotted("slottedCellElements")}></slot>
        </template>
    `;
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/data-grid/data-grid-cell.template.js
var dataGridCellTemplate = (context, definition) => {
  return html2`
        <template
            tabindex="-1"
            role="${(x) => !x.cellType || x.cellType === "default" ? "gridcell" : x.cellType}"
            class="
            ${(x) => x.cellType === "columnheader" ? "column-header" : x.cellType === "rowheader" ? "row-header" : ""}
            "
        >
            <slot></slot>
        </template>
    `;
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/calendar/calendar.template.js
var CalendarTitleTemplate = html2`
    <div
        class="title"
        part="title"
        aria-label="${(x) => x.dateFormatter.getDate(`${x.month}-2-${x.year}`, {
  month: "long",
  year: "numeric"
})}"
    >
        <span part="month">
            ${(x) => x.dateFormatter.getMonth(x.month)}
        </span>
        <span part="year">${(x) => x.dateFormatter.getYear(x.year)}</span>
    </div>
`;
var calendarWeekdayTemplate = (context) => {
  const cellTag = context.tagFor(DataGridCell);
  return html2`
        <${cellTag}
            class="week-day"
            part="week-day"
            tabindex="-1"
            grid-column="${(x, c) => c.index + 1}"
            abbr="${(x) => x.abbr}"
        >
            ${(x) => x.text}
        </${cellTag}>
    `;
};
var calendarCellTemplate = (context, todayString) => {
  const cellTag = context.tagFor(DataGridCell);
  return html2`
        <${cellTag}
            class="${(x, c) => c.parentContext.parent.getDayClassNames(x, todayString)}"
            part="day"
            tabindex="-1"
            role="gridcell"
            grid-column="${(x, c) => c.index + 1}"
            @click="${(x, c) => c.parentContext.parent.handleDateSelect(c.event, x)}"
            @keydown="${(x, c) => c.parentContext.parent.handleKeydown(c.event, x)}"
            aria-label="${(x, c) => c.parentContext.parent.dateFormatter.getDate(`${x.month}-${x.day}-${x.year}`, { month: "long", day: "numeric" })}"
        >
            <div
                class="date"
                part="${(x) => todayString === `${x.month}-${x.day}-${x.year}` ? "today" : "date"}"
            >
                ${(x, c) => c.parentContext.parent.dateFormatter.getDay(x.day)}
            </div>
            <slot name="${(x) => x.month}-${(x) => x.day}-${(x) => x.year}"></slot>
        </${cellTag}>
    `;
};
var calendarRowTemplate = (context, todayString) => {
  const rowTag = context.tagFor(DataGridRow);
  return html2`
        <${rowTag}
            class="week"
            part="week"
            role="row"
            role-type="default"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
        ${repeat((x) => x, calendarCellTemplate(context, todayString), {
    positioning: true
  })}
        </${rowTag}>
    `;
};
var interactiveCalendarGridTemplate = (context, todayString) => {
  const gridTag = context.tagFor(DataGrid);
  const rowTag = context.tagFor(DataGridRow);
  return html2`
    <${gridTag} class="days interact" part="days" generate-header="none">
        <${rowTag}
            class="week-days"
            part="week-days"
            role="row"
            row-type="header"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
            ${repeat((x) => x.getWeekdayText(), calendarWeekdayTemplate(context), {
    positioning: true
  })}
        </${rowTag}>
        ${repeat((x) => x.getDays(), calendarRowTemplate(context, todayString))}
    </${gridTag}>
`;
};
var noninteractiveCalendarTemplate = (todayString) => {
  return html2`
        <div class="days" part="days">
            <div class="week-days" part="week-days">
                ${repeat((x) => x.getWeekdayText(), html2`
                        <div class="week-day" part="week-day" abbr="${(x) => x.abbr}">
                            ${(x) => x.text}
                        </div>
                    `)}
            </div>
            ${repeat((x) => x.getDays(), html2`
                    <div class="week">
                        ${repeat((x) => x, html2`
                                <div
                                    class="${(x, c) => c.parentContext.parent.getDayClassNames(x, todayString)}"
                                    part="day"
                                    aria-label="${(x, c) => c.parentContext.parent.dateFormatter.getDate(`${x.month}-${x.day}-${x.year}`, { month: "long", day: "numeric" })}"
                                >
                                    <div
                                        class="date"
                                        part="${(x) => todayString === `${x.month}-${x.day}-${x.year}` ? "today" : "date"}"
                                    >
                                        ${(x, c) => c.parentContext.parent.dateFormatter.getDay(x.day)}
                                    </div>
                                    <slot
                                        name="${(x) => x.month}-${(x) => x.day}-${(x) => x.year}"
                                    ></slot>
                                </div>
                            `)}
                    </div>
                `)}
        </div>
    `;
};
var calendarTemplate = (context, definition) => {
  var _a;
  const today = /* @__PURE__ */ new Date();
  const todayString = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
  return html2`
        <template>
            ${startTemplate}
            ${definition.title instanceof Function ? definition.title(context, definition) : (_a = definition.title) !== null && _a !== void 0 ? _a : ""}
            <slot></slot>
            ${when((x) => x.readonly, noninteractiveCalendarTemplate(todayString), interactiveCalendarGridTemplate(context, todayString))}
            ${endTemplate}
        </template>
    `;
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/card/card.template.js
var cardTemplate = (context, definition) => html2`
    <slot></slot>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/card/card.js
var Card = class extends FoundationElement {
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/checkbox/checkbox.template.js
var checkboxTemplate = (context, definition) => html2`
    <template
        role="checkbox"
        aria-checked="${(x) => x.checked}"
        aria-required="${(x) => x.required}"
        aria-disabled="${(x) => x.disabled}"
        aria-readonly="${(x) => x.readOnly}"
        tabindex="${(x) => x.disabled ? null : 0}"
        @keypress="${(x, c) => x.keypressHandler(c.event)}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        class="${(x) => x.readOnly ? "readonly" : ""} ${(x) => x.checked ? "checked" : ""} ${(x) => x.indeterminate ? "indeterminate" : ""}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${definition.checkedIndicator || ""}
            </slot>
            <slot name="indeterminate-indicator">
                ${definition.indeterminateIndicator || ""}
            </slot>
        </div>
        <label
            part="label"
            class="${(x) => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/checkbox/checkbox.form-associated.js
var _Checkbox = class extends FoundationElement {
};
var FormAssociatedCheckbox = class extends CheckableFormAssociated(_Checkbox) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/checkbox/checkbox.js
var Checkbox = class extends FormAssociatedCheckbox {
  constructor() {
    super();
    this.initialValue = "on";
    this.indeterminate = false;
    this.keypressHandler = (e) => {
      if (this.readOnly) {
        return;
      }
      switch (e.key) {
        case keySpace:
          if (this.indeterminate) {
            this.indeterminate = false;
          }
          this.checked = !this.checked;
          break;
      }
    };
    this.clickHandler = (e) => {
      if (!this.disabled && !this.readOnly) {
        if (this.indeterminate) {
          this.indeterminate = false;
        }
        this.checked = !this.checked;
      }
    };
    this.proxy.setAttribute("type", "checkbox");
  }
  readOnlyChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.readOnly = this.readOnly;
    }
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], Checkbox.prototype, "readOnly", void 0);
__decorate([
  observable
], Checkbox.prototype, "defaultSlottedNodes", void 0);
__decorate([
  observable
], Checkbox.prototype, "indeterminate", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/listbox-option/listbox-option.js
function isListboxOption(el) {
  return isHTMLElement(el) && (el.getAttribute("role") === "option" || el instanceof HTMLOptionElement);
}
var ListboxOption = class extends FoundationElement {
  constructor(text, value, defaultSelected, selected) {
    super();
    this.defaultSelected = false;
    this.dirtySelected = false;
    this.selected = this.defaultSelected;
    this.dirtyValue = false;
    if (text) {
      this.textContent = text;
    }
    if (value) {
      this.initialValue = value;
    }
    if (defaultSelected) {
      this.defaultSelected = defaultSelected;
    }
    if (selected) {
      this.selected = selected;
    }
    this.proxy = new Option(`${this.textContent}`, this.initialValue, this.defaultSelected, this.selected);
    this.proxy.disabled = this.disabled;
  }
  /**
   * Updates the ariaChecked property when the checked property changes.
   *
   * @param prev - the previous checked value
   * @param next - the current checked value
   *
   * @public
   */
  checkedChanged(prev, next) {
    if (typeof next === "boolean") {
      this.ariaChecked = next ? "true" : "false";
      return;
    }
    this.ariaChecked = null;
  }
  /**
   * Updates the proxy's text content when the default slot changes.
   * @param prev - the previous content value
   * @param next - the current content value
   *
   * @internal
   */
  contentChanged(prev, next) {
    if (this.proxy instanceof HTMLOptionElement) {
      this.proxy.textContent = this.textContent;
    }
    this.$emit("contentchange", null, { bubbles: true });
  }
  defaultSelectedChanged() {
    if (!this.dirtySelected) {
      this.selected = this.defaultSelected;
      if (this.proxy instanceof HTMLOptionElement) {
        this.proxy.selected = this.defaultSelected;
      }
    }
  }
  disabledChanged(prev, next) {
    this.ariaDisabled = this.disabled ? "true" : "false";
    if (this.proxy instanceof HTMLOptionElement) {
      this.proxy.disabled = this.disabled;
    }
  }
  selectedAttributeChanged() {
    this.defaultSelected = this.selectedAttribute;
    if (this.proxy instanceof HTMLOptionElement) {
      this.proxy.defaultSelected = this.defaultSelected;
    }
  }
  selectedChanged() {
    this.ariaSelected = this.selected ? "true" : "false";
    if (!this.dirtySelected) {
      this.dirtySelected = true;
    }
    if (this.proxy instanceof HTMLOptionElement) {
      this.proxy.selected = this.selected;
    }
  }
  initialValueChanged(previous, next) {
    if (!this.dirtyValue) {
      this.value = this.initialValue;
      this.dirtyValue = false;
    }
  }
  get label() {
    var _a;
    return (_a = this.value) !== null && _a !== void 0 ? _a : this.text;
  }
  get text() {
    var _a, _b;
    return (_b = (_a = this.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\s+/g, " ").trim()) !== null && _b !== void 0 ? _b : "";
  }
  set value(next) {
    const newValue = `${next !== null && next !== void 0 ? next : ""}`;
    this._value = newValue;
    this.dirtyValue = true;
    if (this.proxy instanceof HTMLOptionElement) {
      this.proxy.value = newValue;
    }
    Observable.notify(this, "value");
  }
  get value() {
    var _a;
    Observable.track(this, "value");
    return (_a = this._value) !== null && _a !== void 0 ? _a : this.text;
  }
  get form() {
    return this.proxy ? this.proxy.form : null;
  }
};
__decorate([
  observable
], ListboxOption.prototype, "checked", void 0);
__decorate([
  observable
], ListboxOption.prototype, "content", void 0);
__decorate([
  observable
], ListboxOption.prototype, "defaultSelected", void 0);
__decorate([
  attr({ mode: "boolean" })
], ListboxOption.prototype, "disabled", void 0);
__decorate([
  attr({ attribute: "selected", mode: "boolean" })
], ListboxOption.prototype, "selectedAttribute", void 0);
__decorate([
  observable
], ListboxOption.prototype, "selected", void 0);
__decorate([
  attr({ attribute: "value", mode: "fromView" })
], ListboxOption.prototype, "initialValue", void 0);
var DelegatesARIAListboxOption = class {
};
__decorate([
  observable
], DelegatesARIAListboxOption.prototype, "ariaChecked", void 0);
__decorate([
  observable
], DelegatesARIAListboxOption.prototype, "ariaPosInSet", void 0);
__decorate([
  observable
], DelegatesARIAListboxOption.prototype, "ariaSelected", void 0);
__decorate([
  observable
], DelegatesARIAListboxOption.prototype, "ariaSetSize", void 0);
applyMixins(DelegatesARIAListboxOption, ARIAGlobalStatesAndProperties);
applyMixins(ListboxOption, StartEnd, DelegatesARIAListboxOption);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/listbox/listbox.js
var Listbox = class _Listbox extends FoundationElement {
  constructor() {
    super(...arguments);
    this._options = [];
    this.selectedIndex = -1;
    this.selectedOptions = [];
    this.shouldSkipFocus = false;
    this.typeaheadBuffer = "";
    this.typeaheadExpired = true;
    this.typeaheadTimeout = -1;
  }
  /**
   * The first selected option.
   *
   * @internal
   */
  get firstSelectedOption() {
    var _a;
    return (_a = this.selectedOptions[0]) !== null && _a !== void 0 ? _a : null;
  }
  /**
   * Returns true if there is one or more selectable option.
   *
   * @internal
   */
  get hasSelectableOptions() {
    return this.options.length > 0 && !this.options.every((o) => o.disabled);
  }
  /**
   * The number of options.
   *
   * @public
   */
  get length() {
    var _a, _b;
    return (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
  }
  /**
   * The list of options.
   *
   * @public
   */
  get options() {
    Observable.track(this, "options");
    return this._options;
  }
  set options(value) {
    this._options = value;
    Observable.notify(this, "options");
  }
  /**
   * Flag for the typeahead timeout expiration.
   *
   * @deprecated use `Listbox.typeaheadExpired`
   * @internal
   */
  get typeAheadExpired() {
    return this.typeaheadExpired;
  }
  set typeAheadExpired(value) {
    this.typeaheadExpired = value;
  }
  /**
   * Handle click events for listbox options.
   *
   * @internal
   */
  clickHandler(e) {
    const captured = e.target.closest(`option,[role=option]`);
    if (captured && !captured.disabled) {
      this.selectedIndex = this.options.indexOf(captured);
      return true;
    }
  }
  /**
   * Ensures that the provided option is focused and scrolled into view.
   *
   * @param optionToFocus - The option to focus
   * @internal
   */
  focusAndScrollOptionIntoView(optionToFocus = this.firstSelectedOption) {
    if (this.contains(document.activeElement) && optionToFocus !== null) {
      optionToFocus.focus();
      requestAnimationFrame(() => {
        optionToFocus.scrollIntoView({ block: "nearest" });
      });
    }
  }
  /**
   * Handles `focusin` actions for the component. When the component receives focus,
   * the list of selected options is refreshed and the first selected option is scrolled
   * into view.
   *
   * @internal
   */
  focusinHandler(e) {
    if (!this.shouldSkipFocus && e.target === e.currentTarget) {
      this.setSelectedOptions();
      this.focusAndScrollOptionIntoView();
    }
    this.shouldSkipFocus = false;
  }
  /**
   * Returns the options which match the current typeahead buffer.
   *
   * @internal
   */
  getTypeaheadMatches() {
    const pattern = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^${pattern}`, "gi");
    return this.options.filter((o) => o.text.trim().match(re));
  }
  /**
   * Determines the index of the next option which is selectable, if any.
   *
   * @param prev - the previous selected index
   * @param next - the next index to select
   *
   * @internal
   */
  getSelectableIndex(prev = this.selectedIndex, next) {
    const direction2 = prev > next ? -1 : prev < next ? 1 : 0;
    const potentialDirection = prev + direction2;
    let nextSelectableOption = null;
    switch (direction2) {
      case -1: {
        nextSelectableOption = this.options.reduceRight((nextSelectableOption2, thisOption, index) => !nextSelectableOption2 && !thisOption.disabled && index < potentialDirection ? thisOption : nextSelectableOption2, nextSelectableOption);
        break;
      }
      case 1: {
        nextSelectableOption = this.options.reduce((nextSelectableOption2, thisOption, index) => !nextSelectableOption2 && !thisOption.disabled && index > potentialDirection ? thisOption : nextSelectableOption2, nextSelectableOption);
        break;
      }
    }
    return this.options.indexOf(nextSelectableOption);
  }
  /**
   * Handles external changes to child options.
   *
   * @param source - the source object
   * @param propertyName - the property
   *
   * @internal
   */
  handleChange(source, propertyName) {
    switch (propertyName) {
      case "selected": {
        if (_Listbox.slottedOptionFilter(source)) {
          this.selectedIndex = this.options.indexOf(source);
        }
        this.setSelectedOptions();
        break;
      }
    }
  }
  /**
   * Moves focus to an option whose label matches characters typed by the user.
   * Consecutive keystrokes are batched into a buffer of search text used
   * to match against the set of options.  If `TYPE_AHEAD_TIMEOUT_MS` passes
   * between consecutive keystrokes, the search restarts.
   *
   * @param key - the key to be evaluated
   *
   * @internal
   */
  handleTypeAhead(key) {
    if (this.typeaheadTimeout) {
      window.clearTimeout(this.typeaheadTimeout);
    }
    this.typeaheadTimeout = window.setTimeout(() => this.typeaheadExpired = true, _Listbox.TYPE_AHEAD_TIMEOUT_MS);
    if (key.length > 1) {
      return;
    }
    this.typeaheadBuffer = `${this.typeaheadExpired ? "" : this.typeaheadBuffer}${key}`;
  }
  /**
   * Handles `keydown` actions for listbox navigation and typeahead.
   *
   * @internal
   */
  keydownHandler(e) {
    if (this.disabled) {
      return true;
    }
    this.shouldSkipFocus = false;
    const key = e.key;
    switch (key) {
      case keyHome: {
        if (!e.shiftKey) {
          e.preventDefault();
          this.selectFirstOption();
        }
        break;
      }
      case keyArrowDown: {
        if (!e.shiftKey) {
          e.preventDefault();
          this.selectNextOption();
        }
        break;
      }
      case keyArrowUp: {
        if (!e.shiftKey) {
          e.preventDefault();
          this.selectPreviousOption();
        }
        break;
      }
      case keyEnd: {
        e.preventDefault();
        this.selectLastOption();
        break;
      }
      case keyTab: {
        this.focusAndScrollOptionIntoView();
        return true;
      }
      case keyEnter:
      case keyEscape: {
        return true;
      }
      case keySpace: {
        if (this.typeaheadExpired) {
          return true;
        }
      }
      default: {
        if (key.length === 1) {
          this.handleTypeAhead(`${key}`);
        }
        return true;
      }
    }
  }
  /**
   * Prevents `focusin` events from firing before `click` events when the
   * element is unfocused.
   *
   * @internal
   */
  mousedownHandler(e) {
    this.shouldSkipFocus = !this.contains(document.activeElement);
    return true;
  }
  /**
   * Switches between single-selection and multi-selection mode.
   *
   * @param prev - the previous value of the `multiple` attribute
   * @param next - the next value of the `multiple` attribute
   *
   * @internal
   */
  multipleChanged(prev, next) {
    this.ariaMultiSelectable = next ? "true" : null;
  }
  /**
   * Updates the list of selected options when the `selectedIndex` changes.
   *
   * @param prev - the previous selected index value
   * @param next - the current selected index value
   *
   * @internal
   */
  selectedIndexChanged(prev, next) {
    var _a;
    if (!this.hasSelectableOptions) {
      this.selectedIndex = -1;
      return;
    }
    if (((_a = this.options[this.selectedIndex]) === null || _a === void 0 ? void 0 : _a.disabled) && typeof prev === "number") {
      const selectableIndex = this.getSelectableIndex(prev, next);
      const newNext = selectableIndex > -1 ? selectableIndex : prev;
      this.selectedIndex = newNext;
      if (next === newNext) {
        this.selectedIndexChanged(next, newNext);
      }
      return;
    }
    this.setSelectedOptions();
  }
  /**
   * Updates the selectedness of each option when the list of selected options changes.
   *
   * @param prev - the previous list of selected options
   * @param next - the current list of selected options
   *
   * @internal
   */
  selectedOptionsChanged(prev, next) {
    var _a;
    const filteredNext = next.filter(_Listbox.slottedOptionFilter);
    (_a = this.options) === null || _a === void 0 ? void 0 : _a.forEach((o) => {
      const notifier = Observable.getNotifier(o);
      notifier.unsubscribe(this, "selected");
      o.selected = filteredNext.includes(o);
      notifier.subscribe(this, "selected");
    });
  }
  /**
   * Moves focus to the first selectable option.
   *
   * @public
   */
  selectFirstOption() {
    var _a, _b;
    if (!this.disabled) {
      this.selectedIndex = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.findIndex((o) => !o.disabled)) !== null && _b !== void 0 ? _b : -1;
    }
  }
  /**
   * Moves focus to the last selectable option.
   *
   * @internal
   */
  selectLastOption() {
    if (!this.disabled) {
      this.selectedIndex = findLastIndex(this.options, (o) => !o.disabled);
    }
  }
  /**
   * Moves focus to the next selectable option.
   *
   * @internal
   */
  selectNextOption() {
    if (!this.disabled && this.selectedIndex < this.options.length - 1) {
      this.selectedIndex += 1;
    }
  }
  /**
   * Moves focus to the previous selectable option.
   *
   * @internal
   */
  selectPreviousOption() {
    if (!this.disabled && this.selectedIndex > 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
  /**
   * Updates the selected index to match the first selected option.
   *
   * @internal
   */
  setDefaultSelectedOption() {
    var _a, _b;
    this.selectedIndex = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.findIndex((el) => el.defaultSelected)) !== null && _b !== void 0 ? _b : -1;
  }
  /**
   * Sets an option as selected and gives it focus.
   *
   * @public
   */
  setSelectedOptions() {
    var _a, _b, _c;
    if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.length) {
      this.selectedOptions = [this.options[this.selectedIndex]];
      this.ariaActiveDescendant = (_c = (_b = this.firstSelectedOption) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "";
      this.focusAndScrollOptionIntoView();
    }
  }
  /**
   * Updates the list of options and resets the selected option when the slotted option content changes.
   *
   * @param prev - the previous list of slotted options
   * @param next - the current list of slotted options
   *
   * @internal
   */
  slottedOptionsChanged(prev, next) {
    this.options = next.reduce((options, item) => {
      if (isListboxOption(item)) {
        options.push(item);
      }
      return options;
    }, []);
    const setSize = `${this.options.length}`;
    this.options.forEach((option, index) => {
      if (!option.id) {
        option.id = uniqueId("option-");
      }
      option.ariaPosInSet = `${index + 1}`;
      option.ariaSetSize = setSize;
    });
    if (this.$fastController.isConnected) {
      this.setSelectedOptions();
      this.setDefaultSelectedOption();
    }
  }
  /**
   * Updates the filtered list of options when the typeahead buffer changes.
   *
   * @param prev - the previous typeahead buffer value
   * @param next - the current typeahead buffer value
   *
   * @internal
   */
  typeaheadBufferChanged(prev, next) {
    if (this.$fastController.isConnected) {
      const typeaheadMatches = this.getTypeaheadMatches();
      if (typeaheadMatches.length) {
        const selectedIndex = this.options.indexOf(typeaheadMatches[0]);
        if (selectedIndex > -1) {
          this.selectedIndex = selectedIndex;
        }
      }
      this.typeaheadExpired = false;
    }
  }
};
Listbox.slottedOptionFilter = (n) => isListboxOption(n) && !n.hidden;
Listbox.TYPE_AHEAD_TIMEOUT_MS = 1e3;
__decorate([
  attr({ mode: "boolean" })
], Listbox.prototype, "disabled", void 0);
__decorate([
  observable
], Listbox.prototype, "selectedIndex", void 0);
__decorate([
  observable
], Listbox.prototype, "selectedOptions", void 0);
__decorate([
  observable
], Listbox.prototype, "slottedOptions", void 0);
__decorate([
  observable
], Listbox.prototype, "typeaheadBuffer", void 0);
var DelegatesARIAListbox = class {
};
__decorate([
  observable
], DelegatesARIAListbox.prototype, "ariaActiveDescendant", void 0);
__decorate([
  observable
], DelegatesARIAListbox.prototype, "ariaDisabled", void 0);
__decorate([
  observable
], DelegatesARIAListbox.prototype, "ariaExpanded", void 0);
__decorate([
  observable
], DelegatesARIAListbox.prototype, "ariaMultiSelectable", void 0);
applyMixins(DelegatesARIAListbox, ARIAGlobalStatesAndProperties);
applyMixins(Listbox, DelegatesARIAListbox);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/select/select.options.js
var SelectPosition = {
  above: "above",
  below: "below"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/combobox/combobox.form-associated.js
var _Combobox = class extends Listbox {
};
var FormAssociatedCombobox = class extends FormAssociated(_Combobox) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/combobox/combobox.options.js
var ComboboxAutocomplete = {
  inline: "inline",
  list: "list",
  both: "both",
  none: "none"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/combobox/combobox.js
var Combobox = class extends FormAssociatedCombobox {
  constructor() {
    super(...arguments);
    this._value = "";
    this.filteredOptions = [];
    this.filter = "";
    this.forcedPosition = false;
    this.listboxId = uniqueId("listbox-");
    this.maxHeight = 0;
    this.open = false;
  }
  /**
   * Reset the element to its first selectable option when its parent form is reset.
   *
   * @internal
   */
  formResetCallback() {
    super.formResetCallback();
    this.setDefaultSelectedOption();
    this.updateValue();
  }
  /** {@inheritDoc (FormAssociated:interface).validate} */
  validate() {
    super.validate(this.control);
  }
  get isAutocompleteInline() {
    return this.autocomplete === ComboboxAutocomplete.inline || this.isAutocompleteBoth;
  }
  get isAutocompleteList() {
    return this.autocomplete === ComboboxAutocomplete.list || this.isAutocompleteBoth;
  }
  get isAutocompleteBoth() {
    return this.autocomplete === ComboboxAutocomplete.both;
  }
  /**
   * Sets focus and synchronize ARIA attributes when the open property changes.
   *
   * @param prev - the previous open value
   * @param next - the current open value
   *
   * @internal
   */
  openChanged() {
    if (this.open) {
      this.ariaControls = this.listboxId;
      this.ariaExpanded = "true";
      this.setPositioning();
      this.focusAndScrollOptionIntoView();
      DOM.queueUpdate(() => this.focus());
      return;
    }
    this.ariaControls = "";
    this.ariaExpanded = "false";
  }
  /**
   * The list of options.
   *
   * @public
   * @remarks
   * Overrides `Listbox.options`.
   */
  get options() {
    Observable.track(this, "options");
    return this.filteredOptions.length ? this.filteredOptions : this._options;
  }
  set options(value) {
    this._options = value;
    Observable.notify(this, "options");
  }
  /**
   * Updates the placeholder on the proxy element.
   * @internal
   */
  placeholderChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.placeholder = this.placeholder;
    }
  }
  positionChanged(prev, next) {
    this.positionAttribute = next;
    this.setPositioning();
  }
  /**
   * The value property.
   *
   * @public
   */
  get value() {
    Observable.track(this, "value");
    return this._value;
  }
  set value(next) {
    var _a, _b, _c;
    const prev = `${this._value}`;
    if (this.$fastController.isConnected && this.options) {
      const selectedIndex = this.options.findIndex((el) => el.text.toLowerCase() === next.toLowerCase());
      const prevSelectedValue = (_a = this.options[this.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text;
      const nextSelectedValue = (_b = this.options[selectedIndex]) === null || _b === void 0 ? void 0 : _b.text;
      this.selectedIndex = prevSelectedValue !== nextSelectedValue ? selectedIndex : this.selectedIndex;
      next = ((_c = this.firstSelectedOption) === null || _c === void 0 ? void 0 : _c.text) || next;
    }
    if (prev !== next) {
      this._value = next;
      super.valueChanged(prev, next);
      Observable.notify(this, "value");
    }
  }
  /**
   * Handle opening and closing the listbox when the combobox is clicked.
   *
   * @param e - the mouse event
   * @internal
   */
  clickHandler(e) {
    if (this.disabled) {
      return;
    }
    if (this.open) {
      const captured = e.target.closest(`option,[role=option]`);
      if (!captured || captured.disabled) {
        return;
      }
      this.selectedOptions = [captured];
      this.control.value = captured.text;
      this.clearSelectionRange();
      this.updateValue(true);
    }
    this.open = !this.open;
    if (this.open) {
      this.control.focus();
    }
    return true;
  }
  connectedCallback() {
    super.connectedCallback();
    this.forcedPosition = !!this.positionAttribute;
    if (this.value) {
      this.initialValue = this.value;
    }
  }
  /**
   * Synchronize the `aria-disabled` property when the `disabled` property changes.
   *
   * @param prev - The previous disabled value
   * @param next - The next disabled value
   *
   * @internal
   */
  disabledChanged(prev, next) {
    if (super.disabledChanged) {
      super.disabledChanged(prev, next);
    }
    this.ariaDisabled = this.disabled ? "true" : "false";
  }
  /**
   * Filter available options by text value.
   *
   * @public
   */
  filterOptions() {
    if (!this.autocomplete || this.autocomplete === ComboboxAutocomplete.none) {
      this.filter = "";
    }
    const filter = this.filter.toLowerCase();
    this.filteredOptions = this._options.filter((o) => o.text.toLowerCase().startsWith(this.filter.toLowerCase()));
    if (this.isAutocompleteList) {
      if (!this.filteredOptions.length && !filter) {
        this.filteredOptions = this._options;
      }
      this._options.forEach((o) => {
        o.hidden = !this.filteredOptions.includes(o);
      });
    }
  }
  /**
   * Focus the control and scroll the first selected option into view.
   *
   * @internal
   * @remarks
   * Overrides: `Listbox.focusAndScrollOptionIntoView`
   */
  focusAndScrollOptionIntoView() {
    if (this.contains(document.activeElement)) {
      this.control.focus();
      if (this.firstSelectedOption) {
        requestAnimationFrame(() => {
          var _a;
          (_a = this.firstSelectedOption) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: "nearest" });
        });
      }
    }
  }
  /**
   * Handle focus state when the element or its children lose focus.
   *
   * @param e - The focus event
   * @internal
   */
  focusoutHandler(e) {
    this.syncValue();
    if (!this.open) {
      return true;
    }
    const focusTarget = e.relatedTarget;
    if (this.isSameNode(focusTarget)) {
      this.focus();
      return;
    }
    if (!this.options || !this.options.includes(focusTarget)) {
      this.open = false;
    }
  }
  /**
   * Handle content changes on the control input.
   *
   * @param e - the input event
   * @internal
   */
  inputHandler(e) {
    this.filter = this.control.value;
    this.filterOptions();
    if (!this.isAutocompleteInline) {
      this.selectedIndex = this.options.map((option) => option.text).indexOf(this.control.value);
    }
    if (e.inputType.includes("deleteContent") || !this.filter.length) {
      return true;
    }
    if (this.isAutocompleteList && !this.open) {
      this.open = true;
    }
    if (this.isAutocompleteInline) {
      if (this.filteredOptions.length) {
        this.selectedOptions = [this.filteredOptions[0]];
        this.selectedIndex = this.options.indexOf(this.firstSelectedOption);
        this.setInlineSelection();
      } else {
        this.selectedIndex = -1;
      }
    }
    return;
  }
  /**
   * Handle keydown actions for listbox navigation.
   *
   * @param e - the keyboard event
   * @internal
   */
  keydownHandler(e) {
    const key = e.key;
    if (e.ctrlKey || e.shiftKey) {
      return true;
    }
    switch (key) {
      case "Enter": {
        this.syncValue();
        if (this.isAutocompleteInline) {
          this.filter = this.value;
        }
        this.open = false;
        this.clearSelectionRange();
        break;
      }
      case "Escape": {
        if (!this.isAutocompleteInline) {
          this.selectedIndex = -1;
        }
        if (this.open) {
          this.open = false;
          break;
        }
        this.value = "";
        this.control.value = "";
        this.filter = "";
        this.filterOptions();
        break;
      }
      case "Tab": {
        this.setInputToSelection();
        if (!this.open) {
          return true;
        }
        e.preventDefault();
        this.open = false;
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        this.filterOptions();
        if (!this.open) {
          this.open = true;
          break;
        }
        if (this.filteredOptions.length > 0) {
          super.keydownHandler(e);
        }
        if (this.isAutocompleteInline) {
          this.setInlineSelection();
        }
        break;
      }
      default: {
        return true;
      }
    }
  }
  /**
   * Handle keyup actions for value input and text field manipulations.
   *
   * @param e - the keyboard event
   * @internal
   */
  keyupHandler(e) {
    const key = e.key;
    switch (key) {
      case "ArrowLeft":
      case "ArrowRight":
      case "Backspace":
      case "Delete":
      case "Home":
      case "End": {
        this.filter = this.control.value;
        this.selectedIndex = -1;
        this.filterOptions();
        break;
      }
    }
  }
  /**
   * Ensure that the selectedIndex is within the current allowable filtered range.
   *
   * @param prev - the previous selected index value
   * @param next - the current selected index value
   *
   * @internal
   */
  selectedIndexChanged(prev, next) {
    if (this.$fastController.isConnected) {
      next = limit(-1, this.options.length - 1, next);
      if (next !== this.selectedIndex) {
        this.selectedIndex = next;
        return;
      }
      super.selectedIndexChanged(prev, next);
    }
  }
  /**
   * Move focus to the previous selectable option.
   *
   * @internal
   * @remarks
   * Overrides `Listbox.selectPreviousOption`
   */
  selectPreviousOption() {
    if (!this.disabled && this.selectedIndex >= 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
  /**
   * Set the default selected options at initialization or reset.
   *
   * @internal
   * @remarks
   * Overrides `Listbox.setDefaultSelectedOption`
   */
  setDefaultSelectedOption() {
    if (this.$fastController.isConnected && this.options) {
      const selectedIndex = this.options.findIndex((el) => el.getAttribute("selected") !== null || el.selected);
      this.selectedIndex = selectedIndex;
      if (!this.dirtyValue && this.firstSelectedOption) {
        this.value = this.firstSelectedOption.text;
      }
      this.setSelectedOptions();
    }
  }
  /**
   * Focus and set the content of the control based on the first selected option.
   *
   * @internal
   */
  setInputToSelection() {
    if (this.firstSelectedOption) {
      this.control.value = this.firstSelectedOption.text;
      this.control.focus();
    }
  }
  /**
   * Focus, set and select the content of the control based on the first selected option.
   *
   * @internal
   */
  setInlineSelection() {
    if (this.firstSelectedOption) {
      this.setInputToSelection();
      this.control.setSelectionRange(this.filter.length, this.control.value.length, "backward");
    }
  }
  /**
   * Determines if a value update should involve emitting a change event, then updates the value.
   *
   * @internal
   */
  syncValue() {
    var _a;
    const newValue = this.selectedIndex > -1 ? (_a = this.firstSelectedOption) === null || _a === void 0 ? void 0 : _a.text : this.control.value;
    this.updateValue(this.value !== newValue);
  }
  /**
   * Calculate and apply listbox positioning based on available viewport space.
   *
   * @param force - direction to force the listbox to display
   * @public
   */
  setPositioning() {
    const currentBox = this.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const availableBottom = viewportHeight - currentBox.bottom;
    this.position = this.forcedPosition ? this.positionAttribute : currentBox.top > availableBottom ? SelectPosition.above : SelectPosition.below;
    this.positionAttribute = this.forcedPosition ? this.positionAttribute : this.position;
    this.maxHeight = this.position === SelectPosition.above ? ~~currentBox.top : ~~availableBottom;
  }
  /**
   * Ensure that the entire list of options is used when setting the selected property.
   *
   * @param prev - the previous list of selected options
   * @param next - the current list of selected options
   *
   * @internal
   * @remarks
   * Overrides: `Listbox.selectedOptionsChanged`
   */
  selectedOptionsChanged(prev, next) {
    if (this.$fastController.isConnected) {
      this._options.forEach((o) => {
        o.selected = next.includes(o);
      });
    }
  }
  /**
   * Synchronize the form-associated proxy and update the value property of the element.
   *
   * @param prev - the previous collection of slotted option elements
   * @param next - the next collection of slotted option elements
   *
   * @internal
   */
  slottedOptionsChanged(prev, next) {
    super.slottedOptionsChanged(prev, next);
    this.updateValue();
  }
  /**
   * Sets the value and to match the first selected option.
   *
   * @param shouldEmit - if true, the change event will be emitted
   *
   * @internal
   */
  updateValue(shouldEmit) {
    var _a;
    if (this.$fastController.isConnected) {
      this.value = ((_a = this.firstSelectedOption) === null || _a === void 0 ? void 0 : _a.text) || this.control.value;
      this.control.value = this.value;
    }
    if (shouldEmit) {
      this.$emit("change");
    }
  }
  /**
   * @internal
   */
  clearSelectionRange() {
    const controlValueLength = this.control.value.length;
    this.control.setSelectionRange(controlValueLength, controlValueLength);
  }
};
__decorate([
  attr({ attribute: "autocomplete", mode: "fromView" })
], Combobox.prototype, "autocomplete", void 0);
__decorate([
  observable
], Combobox.prototype, "maxHeight", void 0);
__decorate([
  attr({ attribute: "open", mode: "boolean" })
], Combobox.prototype, "open", void 0);
__decorate([
  attr
], Combobox.prototype, "placeholder", void 0);
__decorate([
  attr({ attribute: "position" })
], Combobox.prototype, "positionAttribute", void 0);
__decorate([
  observable
], Combobox.prototype, "position", void 0);
var DelegatesARIACombobox = class {
};
__decorate([
  observable
], DelegatesARIACombobox.prototype, "ariaAutoComplete", void 0);
__decorate([
  observable
], DelegatesARIACombobox.prototype, "ariaControls", void 0);
applyMixins(DelegatesARIACombobox, DelegatesARIAListbox);
applyMixins(Combobox, StartEnd, DelegatesARIACombobox);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/combobox/combobox.template.js
var comboboxTemplate = (context, definition) => html2`
    <template
        aria-disabled="${(x) => x.ariaDisabled}"
        autocomplete="${(x) => x.autocomplete}"
        class="${(x) => x.open ? "open" : ""} ${(x) => x.disabled ? "disabled" : ""} ${(x) => x.position}"
        ?open="${(x) => x.open}"
        tabindex="${(x) => !x.disabled ? "0" : null}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event)}"
        @keydown="${(x, c) => x.keydownHandler(c.event)}"
    >
        <div class="control" part="control">
            ${startSlotTemplate(context, definition)}
            <slot name="control">
                <input
                    aria-activedescendant="${(x) => x.open ? x.ariaActiveDescendant : null}"
                    aria-autocomplete="${(x) => x.ariaAutoComplete}"
                    aria-controls="${(x) => x.ariaControls}"
                    aria-disabled="${(x) => x.ariaDisabled}"
                    aria-expanded="${(x) => x.ariaExpanded}"
                    aria-haspopup="listbox"
                    class="selected-value"
                    part="selected-value"
                    placeholder="${(x) => x.placeholder}"
                    role="combobox"
                    type="text"
                    ?disabled="${(x) => x.disabled}"
                    :value="${(x) => x.value}"
                    @input="${(x, c) => x.inputHandler(c.event)}"
                    @keyup="${(x, c) => x.keyupHandler(c.event)}"
                    ${ref("control")}
                />
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        ${definition.indicator || ""}
                    </slot>
                </div>
            </slot>
            ${endSlotTemplate(context, definition)}
        </div>
        <div
            class="listbox"
            id="${(x) => x.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${(x) => x.disabled}"
            ?hidden="${(x) => !x.open}"
            ${ref("listbox")}
        >
            <slot
                ${slotted({
  filter: Listbox.slottedOptionFilter,
  flatten: true,
  property: "slottedOptions"
})}
            ></slot>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-parent.js
function composedParent(element) {
  const parentNode = element.parentElement;
  if (parentNode) {
    return parentNode;
  } else {
    const rootNode = element.getRootNode();
    if (rootNode.host instanceof HTMLElement) {
      return rootNode.host;
    }
  }
  return null;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-contains.js
function composedContains(reference, test) {
  let current = test;
  while (current !== null) {
    if (current === reference) {
      return true;
    }
    current = composedParent(current);
  }
  return false;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/design-token/custom-property-manager.js
var defaultElement = document.createElement("div");
function isFastElement(element) {
  return element instanceof FASTElement;
}
var QueuedStyleSheetTarget = class {
  setProperty(name, value) {
    DOM.queueUpdate(() => this.target.setProperty(name, value));
  }
  removeProperty(name) {
    DOM.queueUpdate(() => this.target.removeProperty(name));
  }
};
var ConstructableStyleSheetTarget = class extends QueuedStyleSheetTarget {
  constructor(source) {
    super();
    const sheet = new CSSStyleSheet();
    sheet[prependToAdoptedStyleSheetsSymbol] = true;
    this.target = sheet.cssRules[sheet.insertRule(":host{}")].style;
    source.$fastController.addStyles(ElementStyles.create([sheet]));
  }
};
var DocumentStyleSheetTarget = class extends QueuedStyleSheetTarget {
  constructor() {
    super();
    const sheet = new CSSStyleSheet();
    this.target = sheet.cssRules[sheet.insertRule(":root{}")].style;
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      sheet
    ];
  }
};
var HeadStyleElementStyleSheetTarget = class extends QueuedStyleSheetTarget {
  constructor() {
    super();
    this.style = document.createElement("style");
    document.head.appendChild(this.style);
    const { sheet } = this.style;
    if (sheet) {
      const index = sheet.insertRule(":root{}", sheet.cssRules.length);
      this.target = sheet.cssRules[index].style;
    }
  }
};
var StyleElementStyleSheetTarget = class {
  constructor(target2) {
    this.store = /* @__PURE__ */ new Map();
    this.target = null;
    const controller = target2.$fastController;
    this.style = document.createElement("style");
    controller.addStyles(this.style);
    Observable.getNotifier(controller).subscribe(this, "isConnected");
    this.handleChange(controller, "isConnected");
  }
  targetChanged() {
    if (this.target !== null) {
      for (const [key, value] of this.store.entries()) {
        this.target.setProperty(key, value);
      }
    }
  }
  setProperty(name, value) {
    this.store.set(name, value);
    DOM.queueUpdate(() => {
      if (this.target !== null) {
        this.target.setProperty(name, value);
      }
    });
  }
  removeProperty(name) {
    this.store.delete(name);
    DOM.queueUpdate(() => {
      if (this.target !== null) {
        this.target.removeProperty(name);
      }
    });
  }
  handleChange(source, key) {
    const { sheet } = this.style;
    if (sheet) {
      const index = sheet.insertRule(":host{}", sheet.cssRules.length);
      this.target = sheet.cssRules[index].style;
    } else {
      this.target = null;
    }
  }
};
__decorate([
  observable
], StyleElementStyleSheetTarget.prototype, "target", void 0);
var ElementStyleSheetTarget = class {
  constructor(source) {
    this.target = source.style;
  }
  setProperty(name, value) {
    DOM.queueUpdate(() => this.target.setProperty(name, value));
  }
  removeProperty(name) {
    DOM.queueUpdate(() => this.target.removeProperty(name));
  }
};
var RootStyleSheetTarget = class _RootStyleSheetTarget {
  setProperty(name, value) {
    _RootStyleSheetTarget.properties[name] = value;
    for (const target2 of _RootStyleSheetTarget.roots.values()) {
      PropertyTargetManager.getOrCreate(_RootStyleSheetTarget.normalizeRoot(target2)).setProperty(name, value);
    }
  }
  removeProperty(name) {
    delete _RootStyleSheetTarget.properties[name];
    for (const target2 of _RootStyleSheetTarget.roots.values()) {
      PropertyTargetManager.getOrCreate(_RootStyleSheetTarget.normalizeRoot(target2)).removeProperty(name);
    }
  }
  static registerRoot(root) {
    const { roots } = _RootStyleSheetTarget;
    if (!roots.has(root)) {
      roots.add(root);
      const target2 = PropertyTargetManager.getOrCreate(this.normalizeRoot(root));
      for (const key in _RootStyleSheetTarget.properties) {
        target2.setProperty(key, _RootStyleSheetTarget.properties[key]);
      }
    }
  }
  static unregisterRoot(root) {
    const { roots } = _RootStyleSheetTarget;
    if (roots.has(root)) {
      roots.delete(root);
      const target2 = PropertyTargetManager.getOrCreate(_RootStyleSheetTarget.normalizeRoot(root));
      for (const key in _RootStyleSheetTarget.properties) {
        target2.removeProperty(key);
      }
    }
  }
  /**
   * Returns the document when provided the default element,
   * otherwise is a no-op
   * @param root - the root to normalize
   */
  static normalizeRoot(root) {
    return root === defaultElement ? document : root;
  }
};
RootStyleSheetTarget.roots = /* @__PURE__ */ new Set();
RootStyleSheetTarget.properties = {};
var propertyTargetCache = /* @__PURE__ */ new WeakMap();
var propertyTargetCtor = DOM.supportsAdoptedStyleSheets ? ConstructableStyleSheetTarget : StyleElementStyleSheetTarget;
var PropertyTargetManager = Object.freeze({
  getOrCreate(source) {
    if (propertyTargetCache.has(source)) {
      return propertyTargetCache.get(source);
    }
    let target2;
    if (source === defaultElement) {
      target2 = new RootStyleSheetTarget();
    } else if (source instanceof Document) {
      target2 = DOM.supportsAdoptedStyleSheets ? new DocumentStyleSheetTarget() : new HeadStyleElementStyleSheetTarget();
    } else if (isFastElement(source)) {
      target2 = new propertyTargetCtor(source);
    } else {
      target2 = new ElementStyleSheetTarget(source);
    }
    propertyTargetCache.set(source, target2);
    return target2;
  }
});

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/design-token/design-token.js
var DesignTokenImpl = class _DesignTokenImpl extends CSSDirective {
  constructor(configuration) {
    super();
    this.subscribers = /* @__PURE__ */ new WeakMap();
    this._appliedTo = /* @__PURE__ */ new Set();
    this.name = configuration.name;
    if (configuration.cssCustomPropertyName !== null) {
      this.cssCustomProperty = `--${configuration.cssCustomPropertyName}`;
      this.cssVar = `var(${this.cssCustomProperty})`;
    }
    this.id = _DesignTokenImpl.uniqueId();
    _DesignTokenImpl.tokensById.set(this.id, this);
  }
  get appliedTo() {
    return [...this._appliedTo];
  }
  static from(nameOrConfig) {
    return new _DesignTokenImpl({
      name: typeof nameOrConfig === "string" ? nameOrConfig : nameOrConfig.name,
      cssCustomPropertyName: typeof nameOrConfig === "string" ? nameOrConfig : nameOrConfig.cssCustomPropertyName === void 0 ? nameOrConfig.name : nameOrConfig.cssCustomPropertyName
    });
  }
  static isCSSDesignToken(token) {
    return typeof token.cssCustomProperty === "string";
  }
  static isDerivedDesignTokenValue(value) {
    return typeof value === "function";
  }
  /**
   * Gets a token by ID. Returns undefined if the token was not found.
   * @param id - The ID of the token
   * @returns
   */
  static getTokenById(id) {
    return _DesignTokenImpl.tokensById.get(id);
  }
  getOrCreateSubscriberSet(target2 = this) {
    return this.subscribers.get(target2) || this.subscribers.set(target2, /* @__PURE__ */ new Set()) && this.subscribers.get(target2);
  }
  createCSS() {
    return this.cssVar || "";
  }
  getValueFor(element) {
    const value = DesignTokenNode.getOrCreate(element).get(this);
    if (value !== void 0) {
      return value;
    }
    throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${element} or an ancestor of ${element}.`);
  }
  setValueFor(element, value) {
    this._appliedTo.add(element);
    if (value instanceof _DesignTokenImpl) {
      value = this.alias(value);
    }
    DesignTokenNode.getOrCreate(element).set(this, value);
    return this;
  }
  deleteValueFor(element) {
    this._appliedTo.delete(element);
    if (DesignTokenNode.existsFor(element)) {
      DesignTokenNode.getOrCreate(element).delete(this);
    }
    return this;
  }
  withDefault(value) {
    this.setValueFor(defaultElement, value);
    return this;
  }
  subscribe(subscriber, target2) {
    const subscriberSet = this.getOrCreateSubscriberSet(target2);
    if (target2 && !DesignTokenNode.existsFor(target2)) {
      DesignTokenNode.getOrCreate(target2);
    }
    if (!subscriberSet.has(subscriber)) {
      subscriberSet.add(subscriber);
    }
  }
  unsubscribe(subscriber, target2) {
    const list = this.subscribers.get(target2 || this);
    if (list && list.has(subscriber)) {
      list.delete(subscriber);
    }
  }
  /**
   * Notifies subscribers that the value for an element has changed.
   * @param element - The element to emit a notification for
   */
  notify(element) {
    const record = Object.freeze({ token: this, target: element });
    if (this.subscribers.has(this)) {
      this.subscribers.get(this).forEach((sub) => sub.handleChange(record));
    }
    if (this.subscribers.has(element)) {
      this.subscribers.get(element).forEach((sub) => sub.handleChange(record));
    }
  }
  /**
   * Alias the token to the provided token.
   * @param token - the token to alias to
   */
  alias(token) {
    return (target2) => token.getValueFor(target2);
  }
};
DesignTokenImpl.uniqueId = /* @__PURE__ */ (() => {
  let id = 0;
  return () => {
    id++;
    return id.toString(16);
  };
})();
DesignTokenImpl.tokensById = /* @__PURE__ */ new Map();
var CustomPropertyReflector = class {
  startReflection(token, target2) {
    token.subscribe(this, target2);
    this.handleChange({ token, target: target2 });
  }
  stopReflection(token, target2) {
    token.unsubscribe(this, target2);
    this.remove(token, target2);
  }
  handleChange(record) {
    const { token, target: target2 } = record;
    this.add(token, target2);
  }
  add(token, target2) {
    PropertyTargetManager.getOrCreate(target2).setProperty(token.cssCustomProperty, this.resolveCSSValue(DesignTokenNode.getOrCreate(target2).get(token)));
  }
  remove(token, target2) {
    PropertyTargetManager.getOrCreate(target2).removeProperty(token.cssCustomProperty);
  }
  resolveCSSValue(value) {
    return value && typeof value.createCSS === "function" ? value.createCSS() : value;
  }
};
var DesignTokenBindingObserver = class {
  constructor(source, token, node) {
    this.source = source;
    this.token = token;
    this.node = node;
    this.dependencies = /* @__PURE__ */ new Set();
    this.observer = Observable.binding(source, this, false);
    this.observer.handleChange = this.observer.call;
    this.handleChange();
  }
  disconnect() {
    this.observer.disconnect();
  }
  /**
   * @internal
   */
  handleChange() {
    this.node.store.set(this.token, this.observer.observe(this.node.target, defaultExecutionContext));
  }
};
var Store = class {
  constructor() {
    this.values = /* @__PURE__ */ new Map();
  }
  set(token, value) {
    if (this.values.get(token) !== value) {
      this.values.set(token, value);
      Observable.getNotifier(this).notify(token.id);
    }
  }
  get(token) {
    Observable.track(this, token.id);
    return this.values.get(token);
  }
  delete(token) {
    this.values.delete(token);
  }
  all() {
    return this.values.entries();
  }
};
var nodeCache = /* @__PURE__ */ new WeakMap();
var childToParent = /* @__PURE__ */ new WeakMap();
var DesignTokenNode = class _DesignTokenNode {
  constructor(target2) {
    this.target = target2;
    this.store = new Store();
    this.children = [];
    this.assignedValues = /* @__PURE__ */ new Map();
    this.reflecting = /* @__PURE__ */ new Set();
    this.bindingObservers = /* @__PURE__ */ new Map();
    this.tokenValueChangeHandler = {
      handleChange: (source, arg) => {
        const token = DesignTokenImpl.getTokenById(arg);
        if (token) {
          token.notify(this.target);
          this.updateCSSTokenReflection(source, token);
        }
      }
    };
    nodeCache.set(target2, this);
    Observable.getNotifier(this.store).subscribe(this.tokenValueChangeHandler);
    if (target2 instanceof FASTElement) {
      target2.$fastController.addBehaviors([this]);
    } else if (target2.isConnected) {
      this.bind();
    }
  }
  /**
   * Returns a DesignTokenNode for an element.
   * Creates a new instance if one does not already exist for a node,
   * otherwise returns the cached instance
   *
   * @param target - The HTML element to retrieve a DesignTokenNode for
   */
  static getOrCreate(target2) {
    return nodeCache.get(target2) || new _DesignTokenNode(target2);
  }
  /**
   * Determines if a DesignTokenNode has been created for a target
   * @param target - The element to test
   */
  static existsFor(target2) {
    return nodeCache.has(target2);
  }
  /**
   * Searches for and return the nearest parent DesignTokenNode.
   * Null is returned if no node is found or the node provided is for a default element.
   */
  static findParent(node) {
    if (!(defaultElement === node.target)) {
      let parent = composedParent(node.target);
      while (parent !== null) {
        if (nodeCache.has(parent)) {
          return nodeCache.get(parent);
        }
        parent = composedParent(parent);
      }
      return _DesignTokenNode.getOrCreate(defaultElement);
    }
    return null;
  }
  /**
   * Finds the closest node with a value explicitly assigned for a token, otherwise null.
   * @param token - The token to look for
   * @param start - The node to start looking for value assignment
   * @returns
   */
  static findClosestAssignedNode(token, start) {
    let current = start;
    do {
      if (current.has(token)) {
        return current;
      }
      current = current.parent ? current.parent : current.target !== defaultElement ? _DesignTokenNode.getOrCreate(defaultElement) : null;
    } while (current !== null);
    return null;
  }
  /**
   * The parent DesignTokenNode, or null.
   */
  get parent() {
    return childToParent.get(this) || null;
  }
  updateCSSTokenReflection(source, token) {
    if (DesignTokenImpl.isCSSDesignToken(token)) {
      const parent = this.parent;
      const reflecting = this.isReflecting(token);
      if (parent) {
        const parentValue = parent.get(token);
        const sourceValue = source.get(token);
        if (parentValue !== sourceValue && !reflecting) {
          this.reflectToCSS(token);
        } else if (parentValue === sourceValue && reflecting) {
          this.stopReflectToCSS(token);
        }
      } else if (!reflecting) {
        this.reflectToCSS(token);
      }
    }
  }
  /**
   * Checks if a token has been assigned an explicit value the node.
   * @param token - the token to check.
   */
  has(token) {
    return this.assignedValues.has(token);
  }
  /**
   * Gets the value of a token for a node
   * @param token - The token to retrieve the value for
   * @returns
   */
  get(token) {
    const value = this.store.get(token);
    if (value !== void 0) {
      return value;
    }
    const raw = this.getRaw(token);
    if (raw !== void 0) {
      this.hydrate(token, raw);
      return this.get(token);
    }
  }
  /**
   * Retrieves the raw assigned value of a token from the nearest assigned node.
   * @param token - The token to retrieve a raw value for
   * @returns
   */
  getRaw(token) {
    var _a;
    if (this.assignedValues.has(token)) {
      return this.assignedValues.get(token);
    }
    return (_a = _DesignTokenNode.findClosestAssignedNode(token, this)) === null || _a === void 0 ? void 0 : _a.getRaw(token);
  }
  /**
   * Sets a token to a value for a node
   * @param token - The token to set
   * @param value - The value to set the token to
   */
  set(token, value) {
    if (DesignTokenImpl.isDerivedDesignTokenValue(this.assignedValues.get(token))) {
      this.tearDownBindingObserver(token);
    }
    this.assignedValues.set(token, value);
    if (DesignTokenImpl.isDerivedDesignTokenValue(value)) {
      this.setupBindingObserver(token, value);
    } else {
      this.store.set(token, value);
    }
  }
  /**
   * Deletes a token value for the node.
   * @param token - The token to delete the value for
   */
  delete(token) {
    this.assignedValues.delete(token);
    this.tearDownBindingObserver(token);
    const upstream = this.getRaw(token);
    if (upstream) {
      this.hydrate(token, upstream);
    } else {
      this.store.delete(token);
    }
  }
  /**
   * Invoked when the DesignTokenNode.target is attached to the document
   */
  bind() {
    const parent = _DesignTokenNode.findParent(this);
    if (parent) {
      parent.appendChild(this);
    }
    for (const key of this.assignedValues.keys()) {
      key.notify(this.target);
    }
  }
  /**
   * Invoked when the DesignTokenNode.target is detached from the document
   */
  unbind() {
    if (this.parent) {
      const parent = childToParent.get(this);
      parent.removeChild(this);
    }
  }
  /**
   * Appends a child to a parent DesignTokenNode.
   * @param child - The child to append to the node
   */
  appendChild(child) {
    if (child.parent) {
      childToParent.get(child).removeChild(child);
    }
    const reParent = this.children.filter((x) => child.contains(x));
    childToParent.set(child, this);
    this.children.push(child);
    reParent.forEach((x) => child.appendChild(x));
    Observable.getNotifier(this.store).subscribe(child);
    for (const [token, value] of this.store.all()) {
      child.hydrate(token, this.bindingObservers.has(token) ? this.getRaw(token) : value);
    }
  }
  /**
   * Removes a child from a node.
   * @param child - The child to remove.
   */
  removeChild(child) {
    const childIndex = this.children.indexOf(child);
    if (childIndex !== -1) {
      this.children.splice(childIndex, 1);
    }
    Observable.getNotifier(this.store).unsubscribe(child);
    return child.parent === this ? childToParent.delete(child) : false;
  }
  /**
   * Tests whether a provided node is contained by
   * the calling node.
   * @param test - The node to test
   */
  contains(test) {
    return composedContains(this.target, test.target);
  }
  /**
   * Instructs the node to reflect a design token for the provided token.
   * @param token - The design token to reflect
   */
  reflectToCSS(token) {
    if (!this.isReflecting(token)) {
      this.reflecting.add(token);
      _DesignTokenNode.cssCustomPropertyReflector.startReflection(token, this.target);
    }
  }
  /**
   * Stops reflecting a DesignToken to CSS
   * @param token - The design token to stop reflecting
   */
  stopReflectToCSS(token) {
    if (this.isReflecting(token)) {
      this.reflecting.delete(token);
      _DesignTokenNode.cssCustomPropertyReflector.stopReflection(token, this.target);
    }
  }
  /**
   * Determines if a token is being reflected to CSS for a node.
   * @param token - The token to check for reflection
   * @returns
   */
  isReflecting(token) {
    return this.reflecting.has(token);
  }
  /**
   * Handle changes to upstream tokens
   * @param source - The parent DesignTokenNode
   * @param property - The token ID that changed
   */
  handleChange(source, property2) {
    const token = DesignTokenImpl.getTokenById(property2);
    if (!token) {
      return;
    }
    this.hydrate(token, this.getRaw(token));
    this.updateCSSTokenReflection(this.store, token);
  }
  /**
   * Hydrates a token with a DesignTokenValue, making retrieval available.
   * @param token - The token to hydrate
   * @param value - The value to hydrate
   */
  hydrate(token, value) {
    if (!this.has(token)) {
      const observer2 = this.bindingObservers.get(token);
      if (DesignTokenImpl.isDerivedDesignTokenValue(value)) {
        if (observer2) {
          if (observer2.source !== value) {
            this.tearDownBindingObserver(token);
            this.setupBindingObserver(token, value);
          }
        } else {
          this.setupBindingObserver(token, value);
        }
      } else {
        if (observer2) {
          this.tearDownBindingObserver(token);
        }
        this.store.set(token, value);
      }
    }
  }
  /**
   * Sets up a binding observer for a derived token value that notifies token
   * subscribers on change.
   *
   * @param token - The token to notify when the binding updates
   * @param source - The binding source
   */
  setupBindingObserver(token, source) {
    const binding = new DesignTokenBindingObserver(source, token, this);
    this.bindingObservers.set(token, binding);
    return binding;
  }
  /**
   * Tear down a binding observer for a token.
   */
  tearDownBindingObserver(token) {
    if (this.bindingObservers.has(token)) {
      this.bindingObservers.get(token).disconnect();
      this.bindingObservers.delete(token);
      return true;
    }
    return false;
  }
};
DesignTokenNode.cssCustomPropertyReflector = new CustomPropertyReflector();
__decorate([
  observable
], DesignTokenNode.prototype, "children", void 0);
function create(nameOrConfig) {
  return DesignTokenImpl.from(nameOrConfig);
}
var DesignToken = Object.freeze({
  create,
  /**
   * Informs DesignToken that an HTMLElement for which tokens have
   * been set has been connected to the document.
   *
   * The browser does not provide a reliable mechanism to observe an HTMLElement's connectedness
   * in all scenarios, so invoking this method manually is necessary when:
   *
   * 1. Token values are set for an HTMLElement.
   * 2. The HTMLElement does not inherit from FASTElement.
   * 3. The HTMLElement is not connected to the document when token values are set.
   *
   * @param element - The element to notify
   * @returns - true if notification was successful, otherwise false.
   */
  notifyConnection(element) {
    if (!element.isConnected || !DesignTokenNode.existsFor(element)) {
      return false;
    }
    DesignTokenNode.getOrCreate(element).bind();
    return true;
  },
  /**
   * Informs DesignToken that an HTMLElement for which tokens have
   * been set has been disconnected to the document.
   *
   * The browser does not provide a reliable mechanism to observe an HTMLElement's connectedness
   * in all scenarios, so invoking this method manually is necessary when:
   *
   * 1. Token values are set for an HTMLElement.
   * 2. The HTMLElement does not inherit from FASTElement.
   *
   * @param element - The element to notify
   * @returns - true if notification was successful, otherwise false.
   */
  notifyDisconnection(element) {
    if (element.isConnected || !DesignTokenNode.existsFor(element)) {
      return false;
    }
    DesignTokenNode.getOrCreate(element).unbind();
    return true;
  },
  /**
   * Registers and element or document as a DesignToken root.
   * {@link CSSDesignToken | CSSDesignTokens} with default values assigned via
   * {@link (DesignToken:interface).withDefault} will emit CSS custom properties to all
   * registered roots.
   * @param target - The root to register
   */
  registerRoot(target2 = defaultElement) {
    RootStyleSheetTarget.registerRoot(target2);
  },
  /**
   * Unregister an element or document as a DesignToken root.
   * @param target - The root to deregister
   */
  unregisterRoot(target2 = defaultElement) {
    RootStyleSheetTarget.unregisterRoot(target2);
  }
});

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/design-system/design-system.js
var ElementDisambiguation = Object.freeze({
  /**
   * Skip defining the element but still call the provided callback passed
   * to DesignSystemRegistrationContext.tryDefineElement
   */
  definitionCallbackOnly: null,
  /**
   * Ignore the duplicate element entirely.
   */
  ignoreDuplicate: Symbol()
});
var elementTypesByTag = /* @__PURE__ */ new Map();
var elementTagsByType = /* @__PURE__ */ new Map();
var rootDesignSystem = null;
var designSystemKey = DI.createInterface((x) => x.cachedCallback((handler) => {
  if (rootDesignSystem === null) {
    rootDesignSystem = new DefaultDesignSystem(null, handler);
  }
  return rootDesignSystem;
}));
var DesignSystem = Object.freeze({
  /**
   * Returns the HTML element name that the type is defined as.
   * @param type - The type to lookup.
   * @public
   */
  tagFor(type) {
    return elementTagsByType.get(type);
  },
  /**
   * Searches the DOM hierarchy for the design system that is responsible
   * for the provided element.
   * @param element - The element to locate the design system for.
   * @returns The located design system.
   * @public
   */
  responsibleFor(element) {
    const owned = element.$$designSystem$$;
    if (owned) {
      return owned;
    }
    const container = DI.findResponsibleContainer(element);
    return container.get(designSystemKey);
  },
  /**
   * Gets the DesignSystem if one is explicitly defined on the provided element;
   * otherwise creates a design system defined directly on the element.
   * @param element - The element to get or create a design system for.
   * @returns The design system.
   * @public
   */
  getOrCreate(node) {
    if (!node) {
      if (rootDesignSystem === null) {
        rootDesignSystem = DI.getOrCreateDOMContainer().get(designSystemKey);
      }
      return rootDesignSystem;
    }
    const owned = node.$$designSystem$$;
    if (owned) {
      return owned;
    }
    const container = DI.getOrCreateDOMContainer(node);
    if (container.has(designSystemKey, false)) {
      return container.get(designSystemKey);
    } else {
      const system = new DefaultDesignSystem(node, container);
      container.register(Registration.instance(designSystemKey, system));
      return system;
    }
  }
});
function extractTryDefineElementParams(params, elementDefinitionType, elementDefinitionCallback) {
  if (typeof params === "string") {
    return {
      name: params,
      type: elementDefinitionType,
      callback: elementDefinitionCallback
    };
  } else {
    return params;
  }
}
var DefaultDesignSystem = class {
  constructor(owner, container) {
    this.owner = owner;
    this.container = container;
    this.designTokensInitialized = false;
    this.prefix = "fast";
    this.shadowRootMode = void 0;
    this.disambiguate = () => ElementDisambiguation.definitionCallbackOnly;
    if (owner !== null) {
      owner.$$designSystem$$ = this;
    }
  }
  withPrefix(prefix) {
    this.prefix = prefix;
    return this;
  }
  withShadowRootMode(mode) {
    this.shadowRootMode = mode;
    return this;
  }
  withElementDisambiguation(callback) {
    this.disambiguate = callback;
    return this;
  }
  withDesignTokenRoot(root) {
    this.designTokenRoot = root;
    return this;
  }
  register(...registrations) {
    const container = this.container;
    const elementDefinitionEntries = [];
    const disambiguate = this.disambiguate;
    const shadowRootMode = this.shadowRootMode;
    const context = {
      elementPrefix: this.prefix,
      tryDefineElement(params, elementDefinitionType, elementDefinitionCallback) {
        const extractedParams = extractTryDefineElementParams(params, elementDefinitionType, elementDefinitionCallback);
        const { name, callback, baseClass } = extractedParams;
        let { type } = extractedParams;
        let elementName = name;
        let typeFoundByName = elementTypesByTag.get(elementName);
        let needsDefine = true;
        while (typeFoundByName) {
          const result = disambiguate(elementName, type, typeFoundByName);
          switch (result) {
            case ElementDisambiguation.ignoreDuplicate:
              return;
            case ElementDisambiguation.definitionCallbackOnly:
              needsDefine = false;
              typeFoundByName = void 0;
              break;
            default:
              elementName = result;
              typeFoundByName = elementTypesByTag.get(elementName);
              break;
          }
        }
        if (needsDefine) {
          if (elementTagsByType.has(type) || type === FoundationElement) {
            type = class extends type {
            };
          }
          elementTypesByTag.set(elementName, type);
          elementTagsByType.set(type, elementName);
          if (baseClass) {
            elementTagsByType.set(baseClass, elementName);
          }
        }
        elementDefinitionEntries.push(new ElementDefinitionEntry(container, elementName, type, shadowRootMode, callback, needsDefine));
      }
    };
    if (!this.designTokensInitialized) {
      this.designTokensInitialized = true;
      if (this.designTokenRoot !== null) {
        DesignToken.registerRoot(this.designTokenRoot);
      }
    }
    container.registerWithContext(context, ...registrations);
    for (const entry of elementDefinitionEntries) {
      entry.callback(entry);
      if (entry.willDefine && entry.definition !== null) {
        entry.definition.define();
      }
    }
    return this;
  }
};
var ElementDefinitionEntry = class {
  constructor(container, name, type, shadowRootMode, callback, willDefine) {
    this.container = container;
    this.name = name;
    this.type = type;
    this.shadowRootMode = shadowRootMode;
    this.callback = callback;
    this.willDefine = willDefine;
    this.definition = null;
  }
  definePresentation(presentation) {
    ComponentPresentation.define(this.name, presentation, this.container);
  }
  defineElement(definition) {
    this.definition = new FASTElementDefinition(this.type, Object.assign(Object.assign({}, definition), { name: this.name }));
  }
  tagFor(type) {
    return DesignSystem.tagFor(type);
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/dialog/dialog.template.js
var dialogTemplate = (context, definition) => html2`
    <div class="positioning-region" part="positioning-region">
        ${when((x) => x.modal, html2`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    @click="${(x) => x.dismiss()}"
                ></div>
            `)}
        <div
            role="dialog"
            tabindex="-1"
            class="control"
            part="control"
            aria-modal="${(x) => x.modal}"
            aria-describedby="${(x) => x.ariaDescribedby}"
            aria-labelledby="${(x) => x.ariaLabelledby}"
            aria-label="${(x) => x.ariaLabel}"
            ${ref("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;

// ../web-component-sdk/node_modules/tabbable/dist/index.esm.js
var candidateSelectors = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"];
var candidateSelector = candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  return element.getRootNode();
} : function(element) {
  return element.ownerDocument;
};
var getTabindex = function getTabindex2(node, isScope) {
  if (node.tabIndex < 0) {
    if ((isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || node.isContentEditable) && isNaN(parseInt(node.getAttribute("tabindex"), 10))) {
      return 0;
    }
  }
  return node.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot2 = _ref.getShadowRoot;
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  var nodeRootHost = getRootNode(node).host;
  var nodeIsAttached = (nodeRootHost === null || nodeRootHost === void 0 ? void 0 : nodeRootHost.ownerDocument.contains(nodeRootHost)) || node.ownerDocument.contains(node);
  if (!displayCheck || displayCheck === "full") {
    if (typeof getShadowRoot2 === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot2(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (nodeIsAttached) {
      return !node.getClientRects().length;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabindex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isTabbable = function isTabbable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = candidateSelectors.concat("iframe").join(",");
var isFocusable = function isFocusable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/dialog/dialog.js
var Dialog = class _Dialog extends FoundationElement {
  constructor() {
    super(...arguments);
    this.modal = true;
    this.hidden = false;
    this.trapFocus = true;
    this.trapFocusChanged = () => {
      if (this.$fastController.isConnected) {
        this.updateTrapFocus();
      }
    };
    this.isTrappingFocus = false;
    this.handleDocumentKeydown = (e) => {
      if (!e.defaultPrevented && !this.hidden) {
        switch (e.key) {
          case keyEscape:
            this.dismiss();
            e.preventDefault();
            break;
          case keyTab:
            this.handleTabKeyDown(e);
            break;
        }
      }
    };
    this.handleDocumentFocus = (e) => {
      if (!e.defaultPrevented && this.shouldForceFocus(e.target)) {
        this.focusFirstElement();
        e.preventDefault();
      }
    };
    this.handleTabKeyDown = (e) => {
      if (!this.trapFocus || this.hidden) {
        return;
      }
      const bounds = this.getTabQueueBounds();
      if (bounds.length === 0) {
        return;
      }
      if (bounds.length === 1) {
        bounds[0].focus();
        e.preventDefault();
        return;
      }
      if (e.shiftKey && e.target === bounds[0]) {
        bounds[bounds.length - 1].focus();
        e.preventDefault();
      } else if (!e.shiftKey && e.target === bounds[bounds.length - 1]) {
        bounds[0].focus();
        e.preventDefault();
      }
      return;
    };
    this.getTabQueueBounds = () => {
      const bounds = [];
      return _Dialog.reduceTabbableItems(bounds, this);
    };
    this.focusFirstElement = () => {
      const bounds = this.getTabQueueBounds();
      if (bounds.length > 0) {
        bounds[0].focus();
      } else {
        if (this.dialog instanceof HTMLElement) {
          this.dialog.focus();
        }
      }
    };
    this.shouldForceFocus = (currentFocusElement) => {
      return this.isTrappingFocus && !this.contains(currentFocusElement);
    };
    this.shouldTrapFocus = () => {
      return this.trapFocus && !this.hidden;
    };
    this.updateTrapFocus = (shouldTrapFocusOverride) => {
      const shouldTrapFocus = shouldTrapFocusOverride === void 0 ? this.shouldTrapFocus() : shouldTrapFocusOverride;
      if (shouldTrapFocus && !this.isTrappingFocus) {
        this.isTrappingFocus = true;
        document.addEventListener("focusin", this.handleDocumentFocus);
        DOM.queueUpdate(() => {
          if (this.shouldForceFocus(document.activeElement)) {
            this.focusFirstElement();
          }
        });
      } else if (!shouldTrapFocus && this.isTrappingFocus) {
        this.isTrappingFocus = false;
        document.removeEventListener("focusin", this.handleDocumentFocus);
      }
    };
  }
  /**
   * @internal
   */
  dismiss() {
    this.$emit("dismiss");
    this.$emit("cancel");
  }
  /**
   * The method to show the dialog.
   *
   * @public
   */
  show() {
    this.hidden = false;
  }
  /**
   * The method to hide the dialog.
   *
   * @public
   */
  hide() {
    this.hidden = true;
    this.$emit("close");
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.handleDocumentKeydown);
    this.notifier = Observable.getNotifier(this);
    this.notifier.subscribe(this, "hidden");
    this.updateTrapFocus();
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.handleDocumentKeydown);
    this.updateTrapFocus(false);
    this.notifier.unsubscribe(this, "hidden");
  }
  /**
   * @internal
   */
  handleChange(source, propertyName) {
    switch (propertyName) {
      case "hidden":
        this.updateTrapFocus();
        break;
      default:
        break;
    }
  }
  /**
   * Reduce a collection to only its focusable elements.
   *
   * @param elements - Collection of elements to reduce
   * @param element - The current element
   *
   * @internal
   */
  static reduceTabbableItems(elements2, element) {
    if (element.getAttribute("tabindex") === "-1") {
      return elements2;
    }
    if (isTabbable(element) || _Dialog.isFocusableFastElement(element) && _Dialog.hasTabbableShadow(element)) {
      elements2.push(element);
      return elements2;
    }
    if (element.childElementCount) {
      return elements2.concat(Array.from(element.children).reduce(_Dialog.reduceTabbableItems, []));
    }
    return elements2;
  }
  /**
   * Test if element is focusable fast element
   *
   * @param element - The element to check
   *
   * @internal
   */
  static isFocusableFastElement(element) {
    var _a, _b;
    return !!((_b = (_a = element.$fastController) === null || _a === void 0 ? void 0 : _a.definition.shadowOptions) === null || _b === void 0 ? void 0 : _b.delegatesFocus);
  }
  /**
   * Test if the element has a focusable shadow
   *
   * @param element - The element to check
   *
   * @internal
   */
  static hasTabbableShadow(element) {
    var _a, _b;
    return Array.from((_b = (_a = element.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll("*")) !== null && _b !== void 0 ? _b : []).some((x) => {
      return isTabbable(x);
    });
  }
};
__decorate([
  attr({ mode: "boolean" })
], Dialog.prototype, "modal", void 0);
__decorate([
  attr({ mode: "boolean" })
], Dialog.prototype, "hidden", void 0);
__decorate([
  attr({ attribute: "trap-focus", mode: "boolean" })
], Dialog.prototype, "trapFocus", void 0);
__decorate([
  attr({ attribute: "aria-describedby" })
], Dialog.prototype, "ariaDescribedby", void 0);
__decorate([
  attr({ attribute: "aria-labelledby" })
], Dialog.prototype, "ariaLabelledby", void 0);
__decorate([
  attr({ attribute: "aria-label" })
], Dialog.prototype, "ariaLabel", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/directives/reflect-attributes.js
var observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    AttributeReflectionSubscriptionSet.getOrCreateFor(mutation.target).notify(mutation.attributeName);
  }
});
var AttributeReflectionSubscriptionSet = class _AttributeReflectionSubscriptionSet extends SubscriberSet {
  constructor(source) {
    super(source);
    this.watchedAttributes = /* @__PURE__ */ new Set();
    _AttributeReflectionSubscriptionSet.subscriberCache.set(source, this);
  }
  subscribe(subscriber) {
    super.subscribe(subscriber);
    if (!this.watchedAttributes.has(subscriber.attributes)) {
      this.watchedAttributes.add(subscriber.attributes);
      this.observe();
    }
  }
  unsubscribe(subscriber) {
    super.unsubscribe(subscriber);
    if (this.watchedAttributes.has(subscriber.attributes)) {
      this.watchedAttributes.delete(subscriber.attributes);
      this.observe();
    }
  }
  static getOrCreateFor(source) {
    return this.subscriberCache.get(source) || new _AttributeReflectionSubscriptionSet(source);
  }
  observe() {
    const attributeFilter = [];
    for (const attributes of this.watchedAttributes.values()) {
      for (let i = 0; i < attributes.length; i++) {
        attributeFilter.push(attributes[i]);
      }
    }
    observer.observe(this.source, { attributeFilter });
  }
};
AttributeReflectionSubscriptionSet.subscriberCache = /* @__PURE__ */ new WeakMap();

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/disclosure/disclosure.js
var Disclosure = class extends FoundationElement {
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.setup();
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.details.removeEventListener("toggle", this.onToggle);
  }
  /**
   * Show extra content.
   */
  show() {
    this.details.open = true;
  }
  /**
   * Hide extra content.
   */
  hide() {
    this.details.open = false;
  }
  /**
   * Toggle the current(expanded/collapsed) state.
   */
  toggle() {
    this.details.open = !this.details.open;
  }
  /**
   * Register listener and set default disclosure mode
   */
  setup() {
    this.onToggle = this.onToggle.bind(this);
    this.details.addEventListener("toggle", this.onToggle);
    if (this.expanded) {
      this.show();
    }
  }
  /**
   * Update the aria attr and fire `toggle` event
   */
  onToggle() {
    this.expanded = this.details.open;
    this.$emit("toggle");
  }
};
__decorate([
  attr({ mode: "boolean" })
], Disclosure.prototype, "expanded", void 0);
__decorate([
  attr
], Disclosure.prototype, "title", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/divider/divider.template.js
var dividerTemplate = (context, definition) => html2`
    <template role="${(x) => x.role}" aria-orientation="${(x) => x.orientation}"></template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/divider/divider.options.js
var DividerRole = {
  /**
   * The divider semantically separates content
   */
  separator: "separator",
  /**
   * The divider has no semantic value and is for visual presentation only.
   */
  presentation: "presentation"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/divider/divider.js
var Divider = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.role = DividerRole.separator;
    this.orientation = Orientation.horizontal;
  }
};
__decorate([
  attr
], Divider.prototype, "role", void 0);
__decorate([
  attr
], Divider.prototype, "orientation", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/flipper/flipper.options.js
var FlipperDirection = {
  next: "next",
  previous: "previous"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/flipper/flipper.template.js
var flipperTemplate = (context, definition) => html2`
    <template
        role="button"
        aria-disabled="${(x) => x.disabled ? true : void 0}"
        tabindex="${(x) => x.hiddenFromAT ? -1 : 0}"
        class="${(x) => x.direction} ${(x) => x.disabled ? "disabled" : ""}"
        @keyup="${(x, c) => x.keyupHandler(c.event)}"
    >
        ${when((x) => x.direction === FlipperDirection.next, html2`
                <span part="next" class="next">
                    <slot name="next">
                        ${definition.next || ""}
                    </slot>
                </span>
            `)}
        ${when((x) => x.direction === FlipperDirection.previous, html2`
                <span part="previous" class="previous">
                    <slot name="previous">
                        ${definition.previous || ""}
                    </slot>
                </span>
            `)}
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/flipper/flipper.js
var Flipper = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.hiddenFromAT = true;
    this.direction = FlipperDirection.next;
  }
  /**
   * Simulate a click event when the flipper has focus and the user hits enter or space keys
   * Blur focus if the user hits escape key
   * @param e - Keyboard event
   * @public
   */
  keyupHandler(e) {
    if (!this.hiddenFromAT) {
      const key = e.key;
      if (key === "Enter" || key === "Space") {
        this.$emit("click", e);
      }
      if (key === "Escape") {
        this.blur();
      }
    }
  }
};
__decorate([
  attr({ mode: "boolean" })
], Flipper.prototype, "disabled", void 0);
__decorate([
  attr({ attribute: "aria-hidden", converter: booleanConverter })
], Flipper.prototype, "hiddenFromAT", void 0);
__decorate([
  attr
], Flipper.prototype, "direction", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/listbox-option/listbox-option.template.js
var listboxOptionTemplate = (context, definition) => html2`
    <template
        aria-checked="${(x) => x.ariaChecked}"
        aria-disabled="${(x) => x.ariaDisabled}"
        aria-posinset="${(x) => x.ariaPosInSet}"
        aria-selected="${(x) => x.ariaSelected}"
        aria-setsize="${(x) => x.ariaSetSize}"
        class="${(x) => [x.checked && "checked", x.selected && "selected", x.disabled && "disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot ${slotted("content")}></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/listbox/listbox.element.js
var ListboxElement = class extends Listbox {
  constructor() {
    super(...arguments);
    this.activeIndex = -1;
    this.rangeStartIndex = -1;
  }
  /**
   * Returns the last checked option.
   *
   * @internal
   */
  get activeOption() {
    return this.options[this.activeIndex];
  }
  /**
   * Returns the list of checked options.
   *
   * @internal
   */
  get checkedOptions() {
    var _a;
    return (_a = this.options) === null || _a === void 0 ? void 0 : _a.filter((o) => o.checked);
  }
  /**
   * Returns the index of the first selected option.
   *
   * @internal
   */
  get firstSelectedOptionIndex() {
    return this.options.indexOf(this.firstSelectedOption);
  }
  /**
   * Updates the `ariaActiveDescendant` property when the active index changes.
   *
   * @param prev - the previous active index
   * @param next - the next active index
   *
   * @internal
   */
  activeIndexChanged(prev, next) {
    var _a, _b;
    this.ariaActiveDescendant = (_b = (_a = this.options[next]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
    this.focusAndScrollOptionIntoView();
  }
  /**
   * Toggles the checked state for the currently active option.
   *
   * @remarks
   * Multiple-selection mode only.
   *
   * @internal
   */
  checkActiveIndex() {
    if (!this.multiple) {
      return;
    }
    const activeItem = this.activeOption;
    if (activeItem) {
      activeItem.checked = true;
    }
  }
  /**
   * Sets the active index to the first option and marks it as checked.
   *
   * @remarks
   * Multi-selection mode only.
   *
   * @param preserveChecked - mark all options unchecked before changing the active index
   *
   * @internal
   */
  checkFirstOption(preserveChecked = false) {
    if (preserveChecked) {
      if (this.rangeStartIndex === -1) {
        this.rangeStartIndex = this.activeIndex + 1;
      }
      this.options.forEach((o, i) => {
        o.checked = inRange(i, this.rangeStartIndex);
      });
    } else {
      this.uncheckAllOptions();
    }
    this.activeIndex = 0;
    this.checkActiveIndex();
  }
  /**
   * Decrements the active index and sets the matching option as checked.
   *
   * @remarks
   * Multi-selection mode only.
   *
   * @param preserveChecked - mark all options unchecked before changing the active index
   *
   * @internal
   */
  checkLastOption(preserveChecked = false) {
    if (preserveChecked) {
      if (this.rangeStartIndex === -1) {
        this.rangeStartIndex = this.activeIndex;
      }
      this.options.forEach((o, i) => {
        o.checked = inRange(i, this.rangeStartIndex, this.options.length);
      });
    } else {
      this.uncheckAllOptions();
    }
    this.activeIndex = this.options.length - 1;
    this.checkActiveIndex();
  }
  /**
   * @override
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("focusout", this.focusoutHandler);
  }
  /**
   * @override
   * @internal
   */
  disconnectedCallback() {
    this.removeEventListener("focusout", this.focusoutHandler);
    super.disconnectedCallback();
  }
  /**
   * Increments the active index and marks the matching option as checked.
   *
   * @remarks
   * Multiple-selection mode only.
   *
   * @param preserveChecked - mark all options unchecked before changing the active index
   *
   * @internal
   */
  checkNextOption(preserveChecked = false) {
    if (preserveChecked) {
      if (this.rangeStartIndex === -1) {
        this.rangeStartIndex = this.activeIndex;
      }
      this.options.forEach((o, i) => {
        o.checked = inRange(i, this.rangeStartIndex, this.activeIndex + 1);
      });
    } else {
      this.uncheckAllOptions();
    }
    this.activeIndex += this.activeIndex < this.options.length - 1 ? 1 : 0;
    this.checkActiveIndex();
  }
  /**
   * Decrements the active index and marks the matching option as checked.
   *
   * @remarks
   * Multiple-selection mode only.
   *
   * @param preserveChecked - mark all options unchecked before changing the active index
   *
   * @internal
   */
  checkPreviousOption(preserveChecked = false) {
    if (preserveChecked) {
      if (this.rangeStartIndex === -1) {
        this.rangeStartIndex = this.activeIndex;
      }
      if (this.checkedOptions.length === 1) {
        this.rangeStartIndex += 1;
      }
      this.options.forEach((o, i) => {
        o.checked = inRange(i, this.activeIndex, this.rangeStartIndex);
      });
    } else {
      this.uncheckAllOptions();
    }
    this.activeIndex -= this.activeIndex > 0 ? 1 : 0;
    this.checkActiveIndex();
  }
  /**
   * Handles click events for listbox options.
   *
   * @param e - the event object
   *
   * @override
   * @internal
   */
  clickHandler(e) {
    var _a;
    if (!this.multiple) {
      return super.clickHandler(e);
    }
    const captured = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest(`[role=option]`);
    if (!captured || captured.disabled) {
      return;
    }
    this.uncheckAllOptions();
    this.activeIndex = this.options.indexOf(captured);
    this.checkActiveIndex();
    this.toggleSelectedForAllCheckedOptions();
    return true;
  }
  /**
   * @override
   * @internal
   */
  focusAndScrollOptionIntoView() {
    super.focusAndScrollOptionIntoView(this.activeOption);
  }
  /**
   * In multiple-selection mode:
   * If any options are selected, the first selected option is checked when
   * the listbox receives focus. If no options are selected, the first
   * selectable option is checked.
   *
   * @override
   * @internal
   */
  focusinHandler(e) {
    if (!this.multiple) {
      return super.focusinHandler(e);
    }
    if (!this.shouldSkipFocus && e.target === e.currentTarget) {
      this.uncheckAllOptions();
      if (this.activeIndex === -1) {
        this.activeIndex = this.firstSelectedOptionIndex !== -1 ? this.firstSelectedOptionIndex : 0;
      }
      this.checkActiveIndex();
      this.setSelectedOptions();
      this.focusAndScrollOptionIntoView();
    }
    this.shouldSkipFocus = false;
  }
  /**
   * Unchecks all options when the listbox loses focus.
   *
   * @internal
   */
  focusoutHandler(e) {
    if (this.multiple) {
      this.uncheckAllOptions();
    }
  }
  /**
   * Handles keydown actions for listbox navigation and typeahead
   *
   * @override
   * @internal
   */
  keydownHandler(e) {
    if (!this.multiple) {
      return super.keydownHandler(e);
    }
    if (this.disabled) {
      return true;
    }
    const { key, shiftKey } = e;
    this.shouldSkipFocus = false;
    switch (key) {
      case keyHome: {
        this.checkFirstOption(shiftKey);
        return;
      }
      case keyArrowDown: {
        this.checkNextOption(shiftKey);
        return;
      }
      case keyArrowUp: {
        this.checkPreviousOption(shiftKey);
        return;
      }
      case keyEnd: {
        this.checkLastOption(shiftKey);
        return;
      }
      case keyTab: {
        this.focusAndScrollOptionIntoView();
        return true;
      }
      case keyEscape: {
        this.uncheckAllOptions();
        this.checkActiveIndex();
        return true;
      }
      case keySpace: {
        e.preventDefault();
        if (this.typeAheadExpired) {
          this.toggleSelectedForAllCheckedOptions();
          return;
        }
      }
      default: {
        if (key.length === 1) {
          this.handleTypeAhead(`${key}`);
        }
        return true;
      }
    }
  }
  /**
   * Prevents `focusin` events from firing before `click` events when the
   * element is unfocused.
   *
   * @override
   * @internal
   */
  mousedownHandler(e) {
    if (e.offsetX >= 0 && e.offsetX <= this.scrollWidth) {
      return super.mousedownHandler(e);
    }
  }
  /**
   * Switches between single-selection and multi-selection mode.
   *
   * @internal
   */
  multipleChanged(prev, next) {
    var _a;
    this.ariaMultiSelectable = next ? "true" : null;
    (_a = this.options) === null || _a === void 0 ? void 0 : _a.forEach((o) => {
      o.checked = next ? false : void 0;
    });
    this.setSelectedOptions();
  }
  /**
   * Sets an option as selected and gives it focus.
   *
   * @override
   * @public
   */
  setSelectedOptions() {
    if (!this.multiple) {
      super.setSelectedOptions();
      return;
    }
    if (this.$fastController.isConnected && this.options) {
      this.selectedOptions = this.options.filter((o) => o.selected);
      this.focusAndScrollOptionIntoView();
    }
  }
  /**
   * Ensures the size is a positive integer when the property is updated.
   *
   * @param prev - the previous size value
   * @param next - the current size value
   *
   * @internal
   */
  sizeChanged(prev, next) {
    var _a;
    const size = Math.max(0, parseInt((_a = next === null || next === void 0 ? void 0 : next.toFixed()) !== null && _a !== void 0 ? _a : "", 10));
    if (size !== next) {
      DOM.queueUpdate(() => {
        this.size = size;
      });
    }
  }
  /**
   * Toggles the selected state of the provided options. If any provided items
   * are in an unselected state, all items are set to selected. If every
   * provided item is selected, they are all unselected.
   *
   * @internal
   */
  toggleSelectedForAllCheckedOptions() {
    const enabledCheckedOptions = this.checkedOptions.filter((o) => !o.disabled);
    const force = !enabledCheckedOptions.every((o) => o.selected);
    enabledCheckedOptions.forEach((o) => o.selected = force);
    this.selectedIndex = this.options.indexOf(enabledCheckedOptions[enabledCheckedOptions.length - 1]);
    this.setSelectedOptions();
  }
  /**
   * @override
   * @internal
   */
  typeaheadBufferChanged(prev, next) {
    if (!this.multiple) {
      super.typeaheadBufferChanged(prev, next);
      return;
    }
    if (this.$fastController.isConnected) {
      const typeaheadMatches = this.getTypeaheadMatches();
      const activeIndex = this.options.indexOf(typeaheadMatches[0]);
      if (activeIndex > -1) {
        this.activeIndex = activeIndex;
        this.uncheckAllOptions();
        this.checkActiveIndex();
      }
      this.typeAheadExpired = false;
    }
  }
  /**
   * Unchecks all options.
   *
   * @remarks
   * Multiple-selection mode only.
   *
   * @param preserveChecked - reset the rangeStartIndex
   *
   * @internal
   */
  uncheckAllOptions(preserveChecked = false) {
    this.options.forEach((o) => o.checked = this.multiple ? false : void 0);
    if (!preserveChecked) {
      this.rangeStartIndex = -1;
    }
  }
};
__decorate([
  observable
], ListboxElement.prototype, "activeIndex", void 0);
__decorate([
  attr({ mode: "boolean" })
], ListboxElement.prototype, "multiple", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], ListboxElement.prototype, "size", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/listbox/listbox.template.js
var listboxTemplate = (context, definition) => html2`
    <template
        aria-activedescendant="${(x) => x.ariaActiveDescendant}"
        aria-multiselectable="${(x) => x.ariaMultiSelectable}"
        class="listbox"
        role="listbox"
        tabindex="${(x) => !x.disabled ? "0" : null}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        @focusin="${(x, c) => x.focusinHandler(c.event)}"
        @keydown="${(x, c) => x.keydownHandler(c.event)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event)}"
    >
        <slot
            ${slotted({
  filter: ListboxElement.slottedOptionFilter,
  flatten: true,
  property: "slottedOptions"
})}
        ></slot>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/picker/picker-menu.js
var PickerMenu = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.optionElements = [];
  }
  menuElementsChanged() {
    this.updateOptions();
  }
  headerElementsChanged() {
    this.updateOptions();
  }
  footerElementsChanged() {
    this.updateOptions();
  }
  updateOptions() {
    this.optionElements.splice(0, this.optionElements.length);
    this.addSlottedListItems(this.headerElements);
    this.addSlottedListItems(this.menuElements);
    this.addSlottedListItems(this.footerElements);
    this.$emit("optionsupdated", { bubbles: false });
  }
  addSlottedListItems(slotChildren) {
    if (slotChildren === void 0) {
      return;
    }
    slotChildren.forEach((child) => {
      if (child.nodeType === 1 && child.getAttribute("role") === "listitem") {
        child.id = child.id || uniqueId("option-");
        this.optionElements.push(child);
      }
    });
  }
};
__decorate([
  observable
], PickerMenu.prototype, "menuElements", void 0);
__decorate([
  observable
], PickerMenu.prototype, "headerElements", void 0);
__decorate([
  observable
], PickerMenu.prototype, "footerElements", void 0);
__decorate([
  observable
], PickerMenu.prototype, "suggestionsAvailableText", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/picker/picker-menu-option.js
var defaultContentsTemplate = html2`
    <template>
        ${(x) => x.value}
    </template>
`;
var PickerMenuOption = class extends FoundationElement {
  contentsTemplateChanged() {
    if (this.$fastController.isConnected) {
      this.updateView();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.updateView();
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectView();
  }
  handleClick(e) {
    if (e.defaultPrevented) {
      return false;
    }
    this.handleInvoked();
    return false;
  }
  handleInvoked() {
    this.$emit("pickeroptioninvoked");
  }
  updateView() {
    var _a, _b;
    this.disconnectView();
    this.customView = (_b = (_a = this.contentsTemplate) === null || _a === void 0 ? void 0 : _a.render(this, this)) !== null && _b !== void 0 ? _b : defaultContentsTemplate.render(this, this);
  }
  disconnectView() {
    var _a;
    (_a = this.customView) === null || _a === void 0 ? void 0 : _a.dispose();
    this.customView = void 0;
  }
};
__decorate([
  attr({ attribute: "value" })
], PickerMenuOption.prototype, "value", void 0);
__decorate([
  observable
], PickerMenuOption.prototype, "contentsTemplate", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/picker/picker-list-item.js
var defaultContentsTemplate2 = html2`
    <template>
        ${(x) => x.value}
    </template>
`;
var PickerListItem = class extends FoundationElement {
  contentsTemplateChanged() {
    if (this.$fastController.isConnected) {
      this.updateView();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.updateView();
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    this.disconnectView();
    super.disconnectedCallback();
  }
  handleKeyDown(e) {
    if (e.defaultPrevented) {
      return false;
    }
    if (e.key === keyEnter) {
      this.handleInvoke();
      return false;
    }
    return true;
  }
  handleClick(e) {
    if (!e.defaultPrevented) {
      this.handleInvoke();
    }
    return false;
  }
  handleInvoke() {
    this.$emit("pickeriteminvoked");
  }
  updateView() {
    var _a, _b;
    this.disconnectView();
    this.customView = (_b = (_a = this.contentsTemplate) === null || _a === void 0 ? void 0 : _a.render(this, this)) !== null && _b !== void 0 ? _b : defaultContentsTemplate2.render(this, this);
  }
  disconnectView() {
    var _a;
    (_a = this.customView) === null || _a === void 0 ? void 0 : _a.dispose();
    this.customView = void 0;
  }
};
__decorate([
  attr({ attribute: "value" })
], PickerListItem.prototype, "value", void 0);
__decorate([
  observable
], PickerListItem.prototype, "contentsTemplate", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/picker/picker.form-associated.js
var _Picker = class extends FoundationElement {
};
var FormAssociatedPicker = class extends FormAssociated(_Picker) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/picker/picker.js
var pickerInputTemplate = html2`
    <input
        slot="input-region"
        role="combobox"
        type="text"
        autocapitalize="off"
        autocomplete="off"
        haspopup="list"
        aria-label="${(x) => x.label}"
        aria-labelledby="${(x) => x.labelledBy}"
        placeholder="${(x) => x.placeholder}"
        ${ref("inputElement")}
    ></input>
`;
var Picker = class extends FormAssociatedPicker {
  constructor() {
    super(...arguments);
    this.selection = "";
    this.filterSelected = true;
    this.filterQuery = true;
    this.noSuggestionsText = "No suggestions available";
    this.suggestionsAvailableText = "Suggestions available";
    this.loadingText = "Loading suggestions";
    this.menuPlacement = "bottom-fill";
    this.showLoading = false;
    this.optionsList = [];
    this.filteredOptionsList = [];
    this.flyoutOpen = false;
    this.menuFocusIndex = -1;
    this.showNoOptions = false;
    this.selectedItems = [];
    this.inputElementView = null;
    this.handleTextInput = (e) => {
      this.query = this.inputElement.value;
    };
    this.handleInputClick = (e) => {
      e.preventDefault();
      this.toggleFlyout(true);
    };
    this.setRegionProps = () => {
      if (!this.flyoutOpen) {
        return;
      }
      if (this.region === null || this.region === void 0) {
        DOM.queueUpdate(this.setRegionProps);
        return;
      }
      this.region.anchorElement = this.inputElement;
    };
    this.configLookup = {
      top: FlyoutPosTop,
      bottom: FlyoutPosBottom,
      tallest: FlyoutPosTallest,
      "top-fill": FlyoutPosTopFill,
      "bottom-fill": FlyoutPosBottomFill,
      "tallest-fill": FlyoutPosTallestFill
    };
  }
  selectionChanged() {
    if (this.$fastController.isConnected) {
      this.handleSelectionChange();
      if (this.proxy instanceof HTMLInputElement) {
        this.proxy.value = this.selection;
        this.validate();
      }
    }
  }
  optionsChanged() {
    this.optionsList = this.options.split(",").map((opt) => opt.trim()).filter((opt) => opt !== "");
  }
  menuPlacementChanged() {
    if (this.$fastController.isConnected) {
      this.updateMenuConfig();
    }
  }
  showLoadingChanged() {
    if (this.$fastController.isConnected) {
      DOM.queueUpdate(() => {
        this.setFocusedOption(0);
      });
    }
  }
  listItemTemplateChanged() {
    this.updateListItemTemplate();
  }
  defaultListItemTemplateChanged() {
    this.updateListItemTemplate();
  }
  menuOptionTemplateChanged() {
    this.updateOptionTemplate();
  }
  defaultMenuOptionTemplateChanged() {
    this.updateOptionTemplate();
  }
  optionsListChanged() {
    this.updateFilteredOptions();
  }
  queryChanged() {
    if (this.$fastController.isConnected) {
      if (this.inputElement.value !== this.query) {
        this.inputElement.value = this.query;
      }
      this.updateFilteredOptions();
      this.$emit("querychange", { bubbles: false });
    }
  }
  filteredOptionsListChanged() {
    if (this.$fastController.isConnected) {
      this.showNoOptions = this.filteredOptionsList.length === 0 && this.menuElement.querySelectorAll('[role="listitem"]').length === 0;
      this.setFocusedOption(this.showNoOptions ? -1 : 0);
    }
  }
  flyoutOpenChanged() {
    if (this.flyoutOpen) {
      DOM.queueUpdate(this.setRegionProps);
      this.$emit("menuopening", { bubbles: false });
    } else {
      this.$emit("menuclosing", { bubbles: false });
    }
  }
  showNoOptionsChanged() {
    if (this.$fastController.isConnected) {
      DOM.queueUpdate(() => {
        this.setFocusedOption(0);
      });
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.listElement = document.createElement(this.selectedListTag);
    this.appendChild(this.listElement);
    this.itemsPlaceholderElement = document.createComment("");
    this.listElement.append(this.itemsPlaceholderElement);
    this.inputElementView = pickerInputTemplate.render(this, this.listElement);
    const match = this.menuTag.toUpperCase();
    this.menuElement = Array.from(this.children).find((element) => {
      return element.tagName === match;
    });
    if (this.menuElement === void 0) {
      this.menuElement = document.createElement(this.menuTag);
      this.appendChild(this.menuElement);
    }
    if (this.menuElement.id === "") {
      this.menuElement.id = uniqueId("listbox-");
    }
    this.menuId = this.menuElement.id;
    this.optionsPlaceholder = document.createComment("");
    this.menuElement.append(this.optionsPlaceholder);
    this.updateMenuConfig();
    DOM.queueUpdate(() => this.initialize());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.toggleFlyout(false);
    this.inputElement.removeEventListener("input", this.handleTextInput);
    this.inputElement.removeEventListener("click", this.handleInputClick);
    if (this.inputElementView !== null) {
      this.inputElementView.dispose();
      this.inputElementView = null;
    }
  }
  /**
   * Move focus to the input element
   * @public
   */
  focus() {
    this.inputElement.focus();
  }
  /**
   * Initialize the component.  This is delayed a frame to ensure children are connected as well.
   */
  initialize() {
    this.updateListItemTemplate();
    this.updateOptionTemplate();
    this.itemsRepeatBehavior = new RepeatDirective((x) => x.selectedItems, (x) => x.activeListItemTemplate, { positioning: true }).createBehavior(this.itemsPlaceholderElement);
    this.inputElement.addEventListener("input", this.handleTextInput);
    this.inputElement.addEventListener("click", this.handleInputClick);
    this.$fastController.addBehaviors([this.itemsRepeatBehavior]);
    this.menuElement.suggestionsAvailableText = this.suggestionsAvailableText;
    this.menuElement.addEventListener("optionsupdated", this.handleMenuOptionsUpdated);
    this.optionsRepeatBehavior = new RepeatDirective((x) => x.filteredOptionsList, (x) => x.activeMenuOptionTemplate, { positioning: true }).createBehavior(this.optionsPlaceholder);
    this.$fastController.addBehaviors([this.optionsRepeatBehavior]);
    this.handleSelectionChange();
  }
  /**
   * Toggles the menu flyout
   */
  toggleFlyout(open) {
    if (this.flyoutOpen === open) {
      return;
    }
    if (open && document.activeElement === this.inputElement) {
      this.flyoutOpen = open;
      DOM.queueUpdate(() => {
        if (this.menuElement !== void 0) {
          this.setFocusedOption(0);
        } else {
          this.disableMenu();
        }
      });
      return;
    }
    this.flyoutOpen = false;
    this.disableMenu();
    return;
  }
  /**
   * Handle the menu options updated event from the child menu
   */
  handleMenuOptionsUpdated(e) {
    e.preventDefault();
    if (this.flyoutOpen) {
      this.setFocusedOption(0);
    }
  }
  /**
   * Handle key down events.
   */
  handleKeyDown(e) {
    if (e.defaultPrevented) {
      return false;
    }
    switch (e.key) {
      case keyArrowDown: {
        if (!this.flyoutOpen) {
          this.toggleFlyout(true);
        } else {
          const nextFocusOptionIndex = this.flyoutOpen ? Math.min(this.menuFocusIndex + 1, this.menuElement.optionElements.length - 1) : 0;
          this.setFocusedOption(nextFocusOptionIndex);
        }
        return false;
      }
      case keyArrowUp: {
        if (!this.flyoutOpen) {
          this.toggleFlyout(true);
        } else {
          const previousFocusOptionIndex = this.flyoutOpen ? Math.max(this.menuFocusIndex - 1, 0) : 0;
          this.setFocusedOption(previousFocusOptionIndex);
        }
        return false;
      }
      case keyEscape: {
        this.toggleFlyout(false);
        return false;
      }
      case keyEnter: {
        if (this.menuFocusIndex !== -1 && this.menuElement.optionElements.length > this.menuFocusIndex) {
          this.menuElement.optionElements[this.menuFocusIndex].click();
        }
        return false;
      }
      case keyArrowRight: {
        if (document.activeElement !== this.inputElement) {
          this.incrementFocusedItem(1);
          return false;
        }
        return true;
      }
      case keyArrowLeft: {
        if (this.inputElement.selectionStart === 0) {
          this.incrementFocusedItem(-1);
          return false;
        }
        return true;
      }
      case keyDelete:
      case keyBackspace: {
        if (document.activeElement === null) {
          return true;
        }
        if (document.activeElement === this.inputElement) {
          if (this.inputElement.selectionStart === 0) {
            this.selection = this.selectedItems.slice(0, this.selectedItems.length - 1).toString();
            this.toggleFlyout(false);
            return false;
          }
          return true;
        }
        const selectedItems = Array.from(this.listElement.children);
        const currentFocusedItemIndex = selectedItems.indexOf(document.activeElement);
        if (currentFocusedItemIndex > -1) {
          this.selection = this.selectedItems.splice(currentFocusedItemIndex, 1).toString();
          DOM.queueUpdate(() => {
            selectedItems[Math.min(selectedItems.length, currentFocusedItemIndex)].focus();
          });
          return false;
        }
        return true;
      }
    }
    this.toggleFlyout(true);
    return true;
  }
  /**
   * Handle focus in events.
   */
  handleFocusIn(e) {
    return false;
  }
  /**
   * Handle focus out events.
   */
  handleFocusOut(e) {
    if (this.menuElement === void 0 || !this.menuElement.contains(e.relatedTarget)) {
      this.toggleFlyout(false);
    }
    return false;
  }
  /**
   * The list of selected items has changed
   */
  handleSelectionChange() {
    if (this.selectedItems.toString() === this.selection) {
      return;
    }
    this.selectedItems = this.selection === "" ? [] : this.selection.split(",");
    this.updateFilteredOptions();
    DOM.queueUpdate(() => {
      this.checkMaxItems();
    });
    this.$emit("selectionchange", { bubbles: false });
  }
  /**
   * Anchored region is loaded, menu and options exist in the DOM.
   */
  handleRegionLoaded(e) {
    DOM.queueUpdate(() => {
      this.setFocusedOption(0);
      this.$emit("menuloaded", { bubbles: false });
    });
  }
  /**
   * Checks if the maximum number of items has been chosen and updates the ui.
   */
  checkMaxItems() {
    if (this.inputElement === void 0) {
      return;
    }
    if (this.maxSelected !== void 0 && this.selectedItems.length >= this.maxSelected) {
      if (document.activeElement === this.inputElement) {
        const selectedItemInstances = Array.from(this.listElement.querySelectorAll("[role='listitem']"));
        selectedItemInstances[selectedItemInstances.length - 1].focus();
      }
      this.inputElement.hidden = true;
    } else {
      this.inputElement.hidden = false;
    }
  }
  /**
   * A list item has been invoked.
   */
  handleItemInvoke(e) {
    if (e.defaultPrevented) {
      return false;
    }
    if (e.target instanceof PickerListItem) {
      const listItems = Array.from(this.listElement.querySelectorAll("[role='listitem']"));
      const itemIndex = listItems.indexOf(e.target);
      if (itemIndex !== -1) {
        const newSelection = this.selectedItems.slice();
        newSelection.splice(itemIndex, 1);
        this.selection = newSelection.toString();
        DOM.queueUpdate(() => this.incrementFocusedItem(0));
      }
      return false;
    }
    return true;
  }
  /**
   * A menu option has been invoked.
   */
  handleOptionInvoke(e) {
    if (e.defaultPrevented) {
      return false;
    }
    if (e.target instanceof PickerMenuOption) {
      if (e.target.value !== void 0) {
        this.selection = `${this.selection}${this.selection === "" ? "" : ","}${e.target.value}`;
      }
      this.inputElement.value = "";
      this.query = "";
      this.inputElement.focus();
      this.toggleFlyout(false);
      return false;
    }
    return true;
  }
  /**
   * Increments the focused list item by the specified amount
   */
  incrementFocusedItem(increment) {
    if (this.selectedItems.length === 0) {
      this.inputElement.focus();
      return;
    }
    const selectedItemsAsElements = Array.from(this.listElement.querySelectorAll("[role='listitem']"));
    if (document.activeElement !== null) {
      let currentFocusedItemIndex = selectedItemsAsElements.indexOf(document.activeElement);
      if (currentFocusedItemIndex === -1) {
        currentFocusedItemIndex = selectedItemsAsElements.length;
      }
      const newFocusedItemIndex = Math.min(selectedItemsAsElements.length, Math.max(0, currentFocusedItemIndex + increment));
      if (newFocusedItemIndex === selectedItemsAsElements.length) {
        if (this.maxSelected !== void 0 && this.selectedItems.length >= this.maxSelected) {
          selectedItemsAsElements[newFocusedItemIndex - 1].focus();
        } else {
          this.inputElement.focus();
        }
      } else {
        selectedItemsAsElements[newFocusedItemIndex].focus();
      }
    }
  }
  /**
   * Disables the menu. Note that the menu can be open, just doens't have any valid options on display.
   */
  disableMenu() {
    var _a, _b, _c;
    this.menuFocusIndex = -1;
    this.menuFocusOptionId = void 0;
    (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.removeAttribute("aria-activedescendant");
    (_b = this.inputElement) === null || _b === void 0 ? void 0 : _b.removeAttribute("aria-owns");
    (_c = this.inputElement) === null || _c === void 0 ? void 0 : _c.removeAttribute("aria-expanded");
  }
  /**
   * Sets the currently focused menu option by index
   */
  setFocusedOption(optionIndex) {
    if (!this.flyoutOpen || optionIndex === -1 || this.showNoOptions || this.showLoading) {
      this.disableMenu();
      return;
    }
    if (this.menuElement.optionElements.length === 0) {
      return;
    }
    this.menuElement.optionElements.forEach((element) => {
      element.setAttribute("aria-selected", "false");
    });
    this.menuFocusIndex = optionIndex;
    if (this.menuFocusIndex > this.menuElement.optionElements.length - 1) {
      this.menuFocusIndex = this.menuElement.optionElements.length - 1;
    }
    this.menuFocusOptionId = this.menuElement.optionElements[this.menuFocusIndex].id;
    this.inputElement.setAttribute("aria-owns", this.menuId);
    this.inputElement.setAttribute("aria-expanded", "true");
    this.inputElement.setAttribute("aria-activedescendant", this.menuFocusOptionId);
    const focusedOption = this.menuElement.optionElements[this.menuFocusIndex];
    focusedOption.setAttribute("aria-selected", "true");
    this.menuElement.scrollTo(0, focusedOption.offsetTop);
  }
  /**
   * Updates the template used for the list item repeat behavior
   */
  updateListItemTemplate() {
    var _a;
    this.activeListItemTemplate = (_a = this.listItemTemplate) !== null && _a !== void 0 ? _a : this.defaultListItemTemplate;
  }
  /**
   * Updates the template used for the menu option repeat behavior
   */
  updateOptionTemplate() {
    var _a;
    this.activeMenuOptionTemplate = (_a = this.menuOptionTemplate) !== null && _a !== void 0 ? _a : this.defaultMenuOptionTemplate;
  }
  /**
   * Updates the filtered options array
   */
  updateFilteredOptions() {
    this.filteredOptionsList = this.optionsList.slice(0);
    if (this.filterSelected) {
      this.filteredOptionsList = this.filteredOptionsList.filter((el) => this.selectedItems.indexOf(el) === -1);
    }
    if (this.filterQuery && this.query !== "" && this.query !== void 0) {
      this.filteredOptionsList = this.filteredOptionsList.filter((el) => el.indexOf(this.query) !== -1);
    }
  }
  /**
   * Updates the menu configuration
   */
  updateMenuConfig() {
    let newConfig = this.configLookup[this.menuPlacement];
    if (newConfig === null) {
      newConfig = FlyoutPosBottomFill;
    }
    this.menuConfig = Object.assign(Object.assign({}, newConfig), { autoUpdateMode: "auto", fixedPlacement: true, horizontalViewportLock: false, verticalViewportLock: false });
  }
};
__decorate([
  attr({ attribute: "selection" })
], Picker.prototype, "selection", void 0);
__decorate([
  attr({ attribute: "options" })
], Picker.prototype, "options", void 0);
__decorate([
  attr({ attribute: "filter-selected", mode: "boolean" })
], Picker.prototype, "filterSelected", void 0);
__decorate([
  attr({ attribute: "filter-query", mode: "boolean" })
], Picker.prototype, "filterQuery", void 0);
__decorate([
  attr({ attribute: "max-selected" })
], Picker.prototype, "maxSelected", void 0);
__decorate([
  attr({ attribute: "no-suggestions-text" })
], Picker.prototype, "noSuggestionsText", void 0);
__decorate([
  attr({ attribute: "suggestions-available-text" })
], Picker.prototype, "suggestionsAvailableText", void 0);
__decorate([
  attr({ attribute: "loading-text" })
], Picker.prototype, "loadingText", void 0);
__decorate([
  attr({ attribute: "label" })
], Picker.prototype, "label", void 0);
__decorate([
  attr({ attribute: "labelledby" })
], Picker.prototype, "labelledBy", void 0);
__decorate([
  attr({ attribute: "placeholder" })
], Picker.prototype, "placeholder", void 0);
__decorate([
  attr({ attribute: "menu-placement" })
], Picker.prototype, "menuPlacement", void 0);
__decorate([
  observable
], Picker.prototype, "showLoading", void 0);
__decorate([
  observable
], Picker.prototype, "listItemTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "defaultListItemTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "activeListItemTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "menuOptionTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "defaultMenuOptionTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "activeMenuOptionTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "listItemContentsTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "menuOptionContentsTemplate", void 0);
__decorate([
  observable
], Picker.prototype, "optionsList", void 0);
__decorate([
  observable
], Picker.prototype, "query", void 0);
__decorate([
  observable
], Picker.prototype, "filteredOptionsList", void 0);
__decorate([
  observable
], Picker.prototype, "flyoutOpen", void 0);
__decorate([
  observable
], Picker.prototype, "menuId", void 0);
__decorate([
  observable
], Picker.prototype, "selectedListTag", void 0);
__decorate([
  observable
], Picker.prototype, "menuTag", void 0);
__decorate([
  observable
], Picker.prototype, "menuFocusIndex", void 0);
__decorate([
  observable
], Picker.prototype, "menuFocusOptionId", void 0);
__decorate([
  observable
], Picker.prototype, "showNoOptions", void 0);
__decorate([
  observable
], Picker.prototype, "menuConfig", void 0);
__decorate([
  observable
], Picker.prototype, "selectedItems", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/menu-item/menu-item.options.js
var MenuItemRole = {
  /**
   * The menu item has a "menuitem" role
   */
  menuitem: "menuitem",
  /**
   * The menu item has a "menuitemcheckbox" role
   */
  menuitemcheckbox: "menuitemcheckbox",
  /**
   * The menu item has a "menuitemradio" role
   */
  menuitemradio: "menuitemradio"
};
var roleForMenuItem = {
  [MenuItemRole.menuitem]: "menuitem",
  [MenuItemRole.menuitemcheckbox]: "menuitemcheckbox",
  [MenuItemRole.menuitemradio]: "menuitemradio"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/menu-item/menu-item.js
var MenuItem = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.role = MenuItemRole.menuitem;
    this.hasSubmenu = false;
    this.currentDirection = Direction.ltr;
    this.focusSubmenuOnLoad = false;
    this.handleMenuItemKeyDown = (e) => {
      if (e.defaultPrevented) {
        return false;
      }
      switch (e.key) {
        case keyEnter:
        case keySpace:
          this.invoke();
          return false;
        case keyArrowRight:
          this.expandAndFocus();
          return false;
        case keyArrowLeft:
          if (this.expanded) {
            this.expanded = false;
            this.focus();
            return false;
          }
      }
      return true;
    };
    this.handleMenuItemClick = (e) => {
      if (e.defaultPrevented || this.disabled) {
        return false;
      }
      this.invoke();
      return false;
    };
    this.submenuLoaded = () => {
      if (!this.focusSubmenuOnLoad) {
        return;
      }
      this.focusSubmenuOnLoad = false;
      if (this.hasSubmenu) {
        this.submenu.focus();
        this.setAttribute("tabindex", "-1");
      }
    };
    this.handleMouseOver = (e) => {
      if (this.disabled || !this.hasSubmenu || this.expanded) {
        return false;
      }
      this.expanded = true;
      return false;
    };
    this.handleMouseOut = (e) => {
      if (!this.expanded || this.contains(document.activeElement)) {
        return false;
      }
      this.expanded = false;
      return false;
    };
    this.expandAndFocus = () => {
      if (!this.hasSubmenu) {
        return;
      }
      this.focusSubmenuOnLoad = true;
      this.expanded = true;
    };
    this.invoke = () => {
      if (this.disabled) {
        return;
      }
      switch (this.role) {
        case MenuItemRole.menuitemcheckbox:
          this.checked = !this.checked;
          break;
        case MenuItemRole.menuitem:
          this.updateSubmenu();
          if (this.hasSubmenu) {
            this.expandAndFocus();
          } else {
            this.$emit("change");
          }
          break;
        case MenuItemRole.menuitemradio:
          if (!this.checked) {
            this.checked = true;
          }
          break;
      }
    };
    this.updateSubmenu = () => {
      this.submenu = this.domChildren().find((element) => {
        return element.getAttribute("role") === "menu";
      });
      this.hasSubmenu = this.submenu === void 0 ? false : true;
    };
  }
  expandedChanged(oldValue) {
    if (this.$fastController.isConnected) {
      if (this.submenu === void 0) {
        return;
      }
      if (this.expanded === false) {
        this.submenu.collapseExpandedItem();
      } else {
        this.currentDirection = getDirection(this);
      }
      this.$emit("expanded-change", this, { bubbles: false });
    }
  }
  checkedChanged(oldValue, newValue) {
    if (this.$fastController.isConnected) {
      this.$emit("change");
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    DOM.queueUpdate(() => {
      this.updateSubmenu();
    });
    if (!this.startColumnCount) {
      this.startColumnCount = 1;
    }
    this.observer = new MutationObserver(this.updateSubmenu);
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.submenu = void 0;
    if (this.observer !== void 0) {
      this.observer.disconnect();
      this.observer = void 0;
    }
  }
  /**
   * get an array of valid DOM children
   */
  domChildren() {
    return Array.from(this.children).filter((child) => !child.hasAttribute("hidden"));
  }
};
__decorate([
  attr({ mode: "boolean" })
], MenuItem.prototype, "disabled", void 0);
__decorate([
  attr({ mode: "boolean" })
], MenuItem.prototype, "expanded", void 0);
__decorate([
  observable
], MenuItem.prototype, "startColumnCount", void 0);
__decorate([
  attr
], MenuItem.prototype, "role", void 0);
__decorate([
  attr({ mode: "boolean" })
], MenuItem.prototype, "checked", void 0);
__decorate([
  observable
], MenuItem.prototype, "submenuRegion", void 0);
__decorate([
  observable
], MenuItem.prototype, "hasSubmenu", void 0);
__decorate([
  observable
], MenuItem.prototype, "currentDirection", void 0);
__decorate([
  observable
], MenuItem.prototype, "submenu", void 0);
applyMixins(MenuItem, StartEnd);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/menu-item/menu-item.template.js
var menuItemTemplate = (context, definition) => html2`
    <template
        role="${(x) => x.role}"
        aria-haspopup="${(x) => x.hasSubmenu ? "menu" : void 0}"
        aria-checked="${(x) => x.role !== MenuItemRole.menuitem ? x.checked : void 0}"
        aria-disabled="${(x) => x.disabled}"
        aria-expanded="${(x) => x.expanded}"
        @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event)}"
        @click="${(x, c) => x.handleMenuItemClick(c.event)}"
        @mouseover="${(x, c) => x.handleMouseOver(c.event)}"
        @mouseout="${(x, c) => x.handleMouseOut(c.event)}"
        class="${(x) => x.disabled ? "disabled" : ""} ${(x) => x.expanded ? "expanded" : ""} ${(x) => `indent-${x.startColumnCount}`}"
    >
            ${when((x) => x.role === MenuItemRole.menuitemcheckbox, html2`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${definition.checkboxIndicator || ""}
                            </slot>
                        </span>
                    </div>
                `)}
            ${when((x) => x.role === MenuItemRole.menuitemradio, html2`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${definition.radioIndicator || ""}
                            </slot>
                        </span>
                    </div>
                `)}
        </div>
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endSlotTemplate(context, definition)}
        ${when((x) => x.hasSubmenu, html2`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${definition.expandCollapseGlyph || ""}
                        </slot>
                    </span>
                </div>
            `)}
        ${when((x) => x.expanded, html2`
                <${context.tagFor(AnchoredRegion)}
                    :anchorElement="${(x) => x}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu-region"
                    dir="${(x) => x.currentDirection}"
                    @loaded="${(x) => x.submenuLoaded()}"
                    ${ref("submenuRegion")}
                    part="submenu-region"
                >
                    <slot name="submenu"></slot>
                </${context.tagFor(AnchoredRegion)}>
            `)}
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/menu/menu.template.js
var menuTemplate = (context, definition) => html2`
    <template
        slot="${(x) => x.slot ? x.slot : x.isNestedMenu() ? "submenu" : void 0}"
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event)}"
    >
        <slot ${slotted("items")}></slot>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/menu/menu.js
var Menu = class _Menu extends FoundationElement {
  constructor() {
    super(...arguments);
    this.expandedItem = null;
    this.focusIndex = -1;
    this.isNestedMenu = () => {
      return this.parentElement !== null && isHTMLElement(this.parentElement) && this.parentElement.getAttribute("role") === "menuitem";
    };
    this.handleFocusOut = (e) => {
      if (!this.contains(e.relatedTarget) && this.menuItems !== void 0) {
        this.collapseExpandedItem();
        const focusIndex = this.menuItems.findIndex(this.isFocusableElement);
        this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
        this.menuItems[focusIndex].setAttribute("tabindex", "0");
        this.focusIndex = focusIndex;
      }
    };
    this.handleItemFocus = (e) => {
      const targetItem = e.target;
      if (this.menuItems !== void 0 && targetItem !== this.menuItems[this.focusIndex]) {
        this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
        this.focusIndex = this.menuItems.indexOf(targetItem);
        targetItem.setAttribute("tabindex", "0");
      }
    };
    this.handleExpandedChanged = (e) => {
      if (e.defaultPrevented || e.target === null || this.menuItems === void 0 || this.menuItems.indexOf(e.target) < 0) {
        return;
      }
      e.preventDefault();
      const changedItem = e.target;
      if (this.expandedItem !== null && changedItem === this.expandedItem && changedItem.expanded === false) {
        this.expandedItem = null;
        return;
      }
      if (changedItem.expanded) {
        if (this.expandedItem !== null && this.expandedItem !== changedItem) {
          this.expandedItem.expanded = false;
        }
        this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
        this.expandedItem = changedItem;
        this.focusIndex = this.menuItems.indexOf(changedItem);
        changedItem.setAttribute("tabindex", "0");
      }
    };
    this.removeItemListeners = () => {
      if (this.menuItems !== void 0) {
        this.menuItems.forEach((item) => {
          item.removeEventListener("expanded-change", this.handleExpandedChanged);
          item.removeEventListener("focus", this.handleItemFocus);
        });
      }
    };
    this.setItems = () => {
      const newItems = this.domChildren();
      this.removeItemListeners();
      this.menuItems = newItems;
      const menuItems = this.menuItems.filter(this.isMenuItemElement);
      if (menuItems.length) {
        this.focusIndex = 0;
      }
      function elementIndent(el) {
        const role = el.getAttribute("role");
        const startSlot = el.querySelector("[slot=start]");
        if (role !== MenuItemRole.menuitem && startSlot === null) {
          return 1;
        } else if (role === MenuItemRole.menuitem && startSlot !== null) {
          return 1;
        } else if (role !== MenuItemRole.menuitem && startSlot !== null) {
          return 2;
        } else {
          return 0;
        }
      }
      const indent = menuItems.reduce((accum, current) => {
        const elementValue = elementIndent(current);
        return accum > elementValue ? accum : elementValue;
      }, 0);
      menuItems.forEach((item, index) => {
        item.setAttribute("tabindex", index === 0 ? "0" : "-1");
        item.addEventListener("expanded-change", this.handleExpandedChanged);
        item.addEventListener("focus", this.handleItemFocus);
        if (item instanceof MenuItem || "startColumnCount" in item) {
          item.startColumnCount = indent;
        }
      });
    };
    this.changeHandler = (e) => {
      if (this.menuItems === void 0) {
        return;
      }
      const changedMenuItem = e.target;
      const changeItemIndex = this.menuItems.indexOf(changedMenuItem);
      if (changeItemIndex === -1) {
        return;
      }
      if (changedMenuItem.role === "menuitemradio" && changedMenuItem.checked === true) {
        for (let i = changeItemIndex - 1; i >= 0; --i) {
          const item = this.menuItems[i];
          const role = item.getAttribute("role");
          if (role === MenuItemRole.menuitemradio) {
            item.checked = false;
          }
          if (role === "separator") {
            break;
          }
        }
        const maxIndex = this.menuItems.length - 1;
        for (let i = changeItemIndex + 1; i <= maxIndex; ++i) {
          const item = this.menuItems[i];
          const role = item.getAttribute("role");
          if (role === MenuItemRole.menuitemradio) {
            item.checked = false;
          }
          if (role === "separator") {
            break;
          }
        }
      }
    };
    this.isMenuItemElement = (el) => {
      return isHTMLElement(el) && _Menu.focusableElementRoles.hasOwnProperty(el.getAttribute("role"));
    };
    this.isFocusableElement = (el) => {
      return this.isMenuItemElement(el);
    };
  }
  itemsChanged(oldValue, newValue) {
    if (this.$fastController.isConnected && this.menuItems !== void 0) {
      this.setItems();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    DOM.queueUpdate(() => {
      this.setItems();
    });
    this.addEventListener("change", this.changeHandler);
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeItemListeners();
    this.menuItems = void 0;
    this.removeEventListener("change", this.changeHandler);
  }
  /**
   * Focuses the first item in the menu.
   *
   * @public
   */
  focus() {
    this.setFocus(0, 1);
  }
  /**
   * Collapses any expanded menu items.
   *
   * @public
   */
  collapseExpandedItem() {
    if (this.expandedItem !== null) {
      this.expandedItem.expanded = false;
      this.expandedItem = null;
    }
  }
  /**
   * @internal
   */
  handleMenuKeyDown(e) {
    if (e.defaultPrevented || this.menuItems === void 0) {
      return;
    }
    switch (e.key) {
      case keyArrowDown:
        this.setFocus(this.focusIndex + 1, 1);
        return;
      case keyArrowUp:
        this.setFocus(this.focusIndex - 1, -1);
        return;
      case keyEnd:
        this.setFocus(this.menuItems.length - 1, -1);
        return;
      case keyHome:
        this.setFocus(0, 1);
        return;
      default:
        return true;
    }
  }
  /**
   * get an array of valid DOM children
   */
  domChildren() {
    return Array.from(this.children).filter((child) => !child.hasAttribute("hidden"));
  }
  setFocus(focusIndex, adjustment) {
    if (this.menuItems === void 0) {
      return;
    }
    while (focusIndex >= 0 && focusIndex < this.menuItems.length) {
      const child = this.menuItems[focusIndex];
      if (this.isFocusableElement(child)) {
        if (this.focusIndex > -1 && this.menuItems.length >= this.focusIndex - 1) {
          this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
        }
        this.focusIndex = focusIndex;
        child.setAttribute("tabindex", "0");
        child.focus();
        break;
      }
      focusIndex += adjustment;
    }
  }
};
Menu.focusableElementRoles = roleForMenuItem;
__decorate([
  observable
], Menu.prototype, "items", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/number-field/number-field.template.js
var numberFieldTemplate = (context, definition) => html2`
    <template class="${(x) => x.readOnly ? "readonly" : ""}">
        <label
            part="label"
            for="control"
            class="${(x) => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${startSlotTemplate(context, definition)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${(x) => x.handleTextInput()}"
                @change="${(x) => x.handleChange()}"
                @keydown="${(x, c) => x.handleKeyDown(c.event)}"
                @blur="${(x, c) => x.handleBlur()}"
                ?autofocus="${(x) => x.autofocus}"
                ?disabled="${(x) => x.disabled}"
                list="${(x) => x.list}"
                maxlength="${(x) => x.maxlength}"
                minlength="${(x) => x.minlength}"
                placeholder="${(x) => x.placeholder}"
                ?readonly="${(x) => x.readOnly}"
                ?required="${(x) => x.required}"
                size="${(x) => x.size}"
                type="text"
                inputmode="numeric"
                min="${(x) => x.min}"
                max="${(x) => x.max}"
                step="${(x) => x.step}"
                aria-atomic="${(x) => x.ariaAtomic}"
                aria-busy="${(x) => x.ariaBusy}"
                aria-controls="${(x) => x.ariaControls}"
                aria-current="${(x) => x.ariaCurrent}"
                aria-describedby="${(x) => x.ariaDescribedby}"
                aria-details="${(x) => x.ariaDetails}"
                aria-disabled="${(x) => x.ariaDisabled}"
                aria-errormessage="${(x) => x.ariaErrormessage}"
                aria-flowto="${(x) => x.ariaFlowto}"
                aria-haspopup="${(x) => x.ariaHaspopup}"
                aria-hidden="${(x) => x.ariaHidden}"
                aria-invalid="${(x) => x.ariaInvalid}"
                aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
                aria-label="${(x) => x.ariaLabel}"
                aria-labelledby="${(x) => x.ariaLabelledby}"
                aria-live="${(x) => x.ariaLive}"
                aria-owns="${(x) => x.ariaOwns}"
                aria-relevant="${(x) => x.ariaRelevant}"
                aria-roledescription="${(x) => x.ariaRoledescription}"
                ${ref("control")}
            />
            ${when((x) => !x.hideStep && !x.readOnly && !x.disabled, html2`
                    <div class="controls" part="controls">
                        <div class="step-up" part="step-up" @click="${(x) => x.stepUp()}">
                            <slot name="step-up-glyph">
                                ${definition.stepUpGlyph || ""}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${(x) => x.stepDown()}"
                        >
                            <slot name="step-down-glyph">
                                ${definition.stepDownGlyph || ""}
                            </slot>
                        </div>
                    </div>
                `)}
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-field/text-field.form-associated.js
var _TextField = class extends FoundationElement {
};
var FormAssociatedTextField = class extends FormAssociated(_TextField) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-field/text-field.options.js
var TextFieldType = {
  /**
   * An email TextField
   */
  email: "email",
  /**
   * A password TextField
   */
  password: "password",
  /**
   * A telephone TextField
   */
  tel: "tel",
  /**
   * A text TextField
   */
  text: "text",
  /**
   * A URL TextField
   */
  url: "url"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-field/text-field.js
var TextField = class extends FormAssociatedTextField {
  constructor() {
    super(...arguments);
    this.type = TextFieldType.text;
  }
  readOnlyChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.readOnly = this.readOnly;
      this.validate();
    }
  }
  autofocusChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.autofocus = this.autofocus;
      this.validate();
    }
  }
  placeholderChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.placeholder = this.placeholder;
    }
  }
  typeChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.type = this.type;
      this.validate();
    }
  }
  listChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.setAttribute("list", this.list);
      this.validate();
    }
  }
  maxlengthChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.maxLength = this.maxlength;
      this.validate();
    }
  }
  minlengthChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.minLength = this.minlength;
      this.validate();
    }
  }
  patternChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.pattern = this.pattern;
      this.validate();
    }
  }
  sizeChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.size = this.size;
    }
  }
  spellcheckChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.spellcheck = this.spellcheck;
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.proxy.setAttribute("type", this.type);
    this.validate();
    if (this.autofocus) {
      DOM.queueUpdate(() => {
        this.focus();
      });
    }
  }
  /**
   * Selects all the text in the text field
   *
   * @public
   */
  select() {
    this.control.select();
    this.$emit("select");
  }
  /**
   * Handles the internal control's `input` event
   * @internal
   */
  handleTextInput() {
    this.value = this.control.value;
  }
  /**
   * Change event handler for inner control.
   * @remarks
   * "Change" events are not `composable` so they will not
   * permeate the shadow DOM boundary. This fn effectively proxies
   * the change event, emitting a `change` event whenever the internal
   * control emits a `change` event
   * @internal
   */
  handleChange() {
    this.$emit("change");
  }
  /** {@inheritDoc (FormAssociated:interface).validate} */
  validate() {
    super.validate(this.control);
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], TextField.prototype, "readOnly", void 0);
__decorate([
  attr({ mode: "boolean" })
], TextField.prototype, "autofocus", void 0);
__decorate([
  attr
], TextField.prototype, "placeholder", void 0);
__decorate([
  attr
], TextField.prototype, "type", void 0);
__decorate([
  attr
], TextField.prototype, "list", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], TextField.prototype, "maxlength", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], TextField.prototype, "minlength", void 0);
__decorate([
  attr
], TextField.prototype, "pattern", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], TextField.prototype, "size", void 0);
__decorate([
  attr({ mode: "boolean" })
], TextField.prototype, "spellcheck", void 0);
__decorate([
  observable
], TextField.prototype, "defaultSlottedNodes", void 0);
var DelegatesARIATextbox = class {
};
applyMixins(DelegatesARIATextbox, ARIAGlobalStatesAndProperties);
applyMixins(TextField, StartEnd, DelegatesARIATextbox);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/number-field/number-field.form-associated.js
var _NumberField = class extends FoundationElement {
};
var FormAssociatedNumberField = class extends FormAssociated(_NumberField) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/number-field/number-field.js
var NumberField = class extends FormAssociatedNumberField {
  constructor() {
    super(...arguments);
    this.hideStep = false;
    this.step = 1;
    this.isUserInput = false;
  }
  /**
   * Ensures that the max is greater than the min and that the value
   *  is less than the max
   * @param previous - the previous max value
   * @param next - updated max value
   *
   * @internal
   */
  maxChanged(previous, next) {
    var _a;
    this.max = Math.max(next, (_a = this.min) !== null && _a !== void 0 ? _a : next);
    const min = Math.min(this.min, this.max);
    if (this.min !== void 0 && this.min !== min) {
      this.min = min;
    }
    this.value = this.getValidValue(this.value);
  }
  /**
   * Ensures that the min is less than the max and that the value
   *  is greater than the min
   * @param previous - previous min value
   * @param next - updated min value
   *
   * @internal
   */
  minChanged(previous, next) {
    var _a;
    this.min = Math.min(next, (_a = this.max) !== null && _a !== void 0 ? _a : next);
    const max = Math.max(this.min, this.max);
    if (this.max !== void 0 && this.max !== max) {
      this.max = max;
    }
    this.value = this.getValidValue(this.value);
  }
  /**
   * The value property, typed as a number.
   *
   * @public
   */
  get valueAsNumber() {
    return parseFloat(super.value);
  }
  set valueAsNumber(next) {
    this.value = next.toString();
  }
  /**
   * Validates that the value is a number between the min and max
   * @param previous - previous stored value
   * @param next - value being updated
   * @param updateControl - should the text field be updated with value, defaults to true
   * @internal
   */
  valueChanged(previous, next) {
    this.value = this.getValidValue(next);
    if (next !== this.value) {
      return;
    }
    if (this.control && !this.isUserInput) {
      this.control.value = this.value;
    }
    super.valueChanged(previous, this.value);
    if (previous !== void 0 && !this.isUserInput) {
      this.$emit("input");
      this.$emit("change");
    }
    this.isUserInput = false;
  }
  /** {@inheritDoc (FormAssociated:interface).validate} */
  validate() {
    super.validate(this.control);
  }
  /**
   * Sets the internal value to a valid number between the min and max properties
   * @param value - user input
   *
   * @internal
   */
  getValidValue(value) {
    var _a, _b;
    let validValue = parseFloat(parseFloat(value).toPrecision(12));
    if (isNaN(validValue)) {
      validValue = "";
    } else {
      validValue = Math.min(validValue, (_a = this.max) !== null && _a !== void 0 ? _a : validValue);
      validValue = Math.max(validValue, (_b = this.min) !== null && _b !== void 0 ? _b : validValue).toString();
    }
    return validValue;
  }
  /**
   * Increments the value using the step value
   *
   * @public
   */
  stepUp() {
    const value = parseFloat(this.value);
    const stepUpValue = !isNaN(value) ? value + this.step : this.min > 0 ? this.min : this.max < 0 ? this.max : !this.min ? this.step : 0;
    this.value = stepUpValue.toString();
  }
  /**
   * Decrements the value using the step value
   *
   * @public
   */
  stepDown() {
    const value = parseFloat(this.value);
    const stepDownValue = !isNaN(value) ? value - this.step : this.min > 0 ? this.min : this.max < 0 ? this.max : !this.min ? 0 - this.step : 0;
    this.value = stepDownValue.toString();
  }
  /**
   * Sets up the initial state of the number field
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.proxy.setAttribute("type", "number");
    this.validate();
    this.control.value = this.value;
    if (this.autofocus) {
      DOM.queueUpdate(() => {
        this.focus();
      });
    }
  }
  /**
   * Selects all the text in the number field
   *
   * @public
   */
  select() {
    this.control.select();
    this.$emit("select");
  }
  /**
   * Handles the internal control's `input` event
   * @internal
   */
  handleTextInput() {
    this.control.value = this.control.value.replace(/[^0-9\-+e.]/g, "");
    this.isUserInput = true;
    this.value = this.control.value;
  }
  /**
   * Change event handler for inner control.
   * @remarks
   * "Change" events are not `composable` so they will not
   * permeate the shadow DOM boundary. This fn effectively proxies
   * the change event, emitting a `change` event whenever the internal
   * control emits a `change` event
   * @internal
   */
  handleChange() {
    this.$emit("change");
  }
  /**
   * Handles the internal control's `keydown` event
   * @internal
   */
  handleKeyDown(e) {
    const key = e.key;
    switch (key) {
      case keyArrowUp:
        this.stepUp();
        return false;
      case keyArrowDown:
        this.stepDown();
        return false;
    }
    return true;
  }
  /**
   * Handles populating the input field with a validated value when
   *  leaving the input field.
   * @internal
   */
  handleBlur() {
    this.control.value = this.value;
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], NumberField.prototype, "readOnly", void 0);
__decorate([
  attr({ mode: "boolean" })
], NumberField.prototype, "autofocus", void 0);
__decorate([
  attr({ attribute: "hide-step", mode: "boolean" })
], NumberField.prototype, "hideStep", void 0);
__decorate([
  attr
], NumberField.prototype, "placeholder", void 0);
__decorate([
  attr
], NumberField.prototype, "list", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], NumberField.prototype, "maxlength", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], NumberField.prototype, "minlength", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], NumberField.prototype, "size", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], NumberField.prototype, "step", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], NumberField.prototype, "max", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], NumberField.prototype, "min", void 0);
__decorate([
  observable
], NumberField.prototype, "defaultSlottedNodes", void 0);
applyMixins(NumberField, StartEnd, DelegatesARIATextbox);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/progress-ring/progress-ring.template.js
var progressSegments = 44;
var progressRingTemplate = (context, definition) => html2`
    <template
        role="progressbar"
        aria-valuenow="${(x) => x.value}"
        aria-valuemin="${(x) => x.min}"
        aria-valuemax="${(x) => x.max}"
        class="${(x) => x.paused ? "paused" : ""}"
    >
        ${when((x) => typeof x.value === "number", html2`
                <svg
                    class="progress"
                    part="progress"
                    viewBox="0 0 16 16"
                    slot="determinate"
                >
                    <circle
                        class="background"
                        part="background"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                    <circle
                        class="determinate"
                        part="determinate"
                        style="stroke-dasharray: ${(x) => progressSegments * x.percentComplete / 100}px ${progressSegments}px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `, html2`
                <slot name="indeterminate" slot="indeterminate">
                    ${definition.indeterminateIndicator || ""}
                </slot>
            `)}
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/progress/base-progress.js
var BaseProgress = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.percentComplete = 0;
  }
  valueChanged() {
    if (this.$fastController.isConnected) {
      this.updatePercentComplete();
    }
  }
  minChanged() {
    if (this.$fastController.isConnected) {
      this.updatePercentComplete();
    }
  }
  maxChanged() {
    if (this.$fastController.isConnected) {
      this.updatePercentComplete();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.updatePercentComplete();
  }
  updatePercentComplete() {
    const min = typeof this.min === "number" ? this.min : 0;
    const max = typeof this.max === "number" ? this.max : 100;
    const value = typeof this.value === "number" ? this.value : 0;
    const range2 = max - min;
    this.percentComplete = range2 === 0 ? 0 : Math.fround((value - min) / range2 * 100);
  }
};
__decorate([
  attr({ converter: nullableNumberConverter })
], BaseProgress.prototype, "value", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], BaseProgress.prototype, "min", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], BaseProgress.prototype, "max", void 0);
__decorate([
  attr({ mode: "boolean" })
], BaseProgress.prototype, "paused", void 0);
__decorate([
  observable
], BaseProgress.prototype, "percentComplete", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/progress/progress.template.js
var progressTemplate = (context, defintion) => html2`
    <template
        role="progressbar"
        aria-valuenow="${(x) => x.value}"
        aria-valuemin="${(x) => x.min}"
        aria-valuemax="${(x) => x.max}"
        class="${(x) => x.paused ? "paused" : ""}"
    >
        ${when((x) => typeof x.value === "number", html2`
                <div class="progress" part="progress" slot="determinate">
                    <div
                        class="determinate"
                        part="determinate"
                        style="width: ${(x) => x.percentComplete}%"
                    ></div>
                </div>
            `, html2`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot class="indeterminate" name="indeterminate">
                        ${defintion.indeterminateIndicator1 || ""}
                        ${defintion.indeterminateIndicator2 || ""}
                    </slot>
                </div>
            `)}
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/radio-group/radio-group.template.js
var radioGroupTemplate = (context, definition) => html2`
    <template
        role="radiogroup"
        aria-disabled="${(x) => x.disabled}"
        aria-readonly="${(x) => x.readOnly}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        @keydown="${(x, c) => x.keydownHandler(c.event)}"
        @focusout="${(x, c) => x.focusOutHandler(c.event)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${(x) => x.orientation === Orientation.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot
                ${slotted({
  property: "slottedRadioButtons",
  filter: elements("[role=radio]")
})}
            ></slot>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/radio-group/radio-group.js
var RadioGroup = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.orientation = Orientation.horizontal;
    this.radioChangeHandler = (e) => {
      const changedRadio = e.target;
      if (changedRadio.checked) {
        this.slottedRadioButtons.forEach((radio) => {
          if (radio !== changedRadio) {
            radio.checked = false;
            if (!this.isInsideFoundationToolbar) {
              radio.setAttribute("tabindex", "-1");
            }
          }
        });
        this.selectedRadio = changedRadio;
        this.value = changedRadio.value;
        changedRadio.setAttribute("tabindex", "0");
        this.focusedRadio = changedRadio;
      }
      e.stopPropagation();
    };
    this.moveToRadioByIndex = (group, index) => {
      const radio = group[index];
      if (!this.isInsideToolbar) {
        radio.setAttribute("tabindex", "0");
        if (radio.readOnly) {
          this.slottedRadioButtons.forEach((nextRadio) => {
            if (nextRadio !== radio) {
              nextRadio.setAttribute("tabindex", "-1");
            }
          });
        } else {
          radio.checked = true;
          this.selectedRadio = radio;
        }
      }
      this.focusedRadio = radio;
      radio.focus();
    };
    this.moveRightOffGroup = () => {
      var _a;
      (_a = this.nextElementSibling) === null || _a === void 0 ? void 0 : _a.focus();
    };
    this.moveLeftOffGroup = () => {
      var _a;
      (_a = this.previousElementSibling) === null || _a === void 0 ? void 0 : _a.focus();
    };
    this.focusOutHandler = (e) => {
      const group = this.slottedRadioButtons;
      const radio = e.target;
      const index = radio !== null ? group.indexOf(radio) : 0;
      const focusedIndex = this.focusedRadio ? group.indexOf(this.focusedRadio) : -1;
      if (focusedIndex === 0 && index === focusedIndex || focusedIndex === group.length - 1 && focusedIndex === index) {
        if (!this.selectedRadio) {
          this.focusedRadio = group[0];
          this.focusedRadio.setAttribute("tabindex", "0");
          group.forEach((nextRadio) => {
            if (nextRadio !== this.focusedRadio) {
              nextRadio.setAttribute("tabindex", "-1");
            }
          });
        } else {
          this.focusedRadio = this.selectedRadio;
          if (!this.isInsideFoundationToolbar) {
            this.selectedRadio.setAttribute("tabindex", "0");
            group.forEach((nextRadio) => {
              if (nextRadio !== this.selectedRadio) {
                nextRadio.setAttribute("tabindex", "-1");
              }
            });
          }
        }
      }
      return true;
    };
    this.clickHandler = (e) => {
      const radio = e.target;
      if (radio) {
        const group = this.slottedRadioButtons;
        if (radio.checked || group.indexOf(radio) === 0) {
          radio.setAttribute("tabindex", "0");
          this.selectedRadio = radio;
        } else {
          radio.setAttribute("tabindex", "-1");
          this.selectedRadio = null;
        }
        this.focusedRadio = radio;
      }
      e.preventDefault();
    };
    this.shouldMoveOffGroupToTheRight = (index, group, key) => {
      return index === group.length && this.isInsideToolbar && key === keyArrowRight;
    };
    this.shouldMoveOffGroupToTheLeft = (group, key) => {
      const index = this.focusedRadio ? group.indexOf(this.focusedRadio) - 1 : 0;
      return index < 0 && this.isInsideToolbar && key === keyArrowLeft;
    };
    this.checkFocusedRadio = () => {
      if (this.focusedRadio !== null && !this.focusedRadio.readOnly && !this.focusedRadio.checked) {
        this.focusedRadio.checked = true;
        this.focusedRadio.setAttribute("tabindex", "0");
        this.focusedRadio.focus();
        this.selectedRadio = this.focusedRadio;
      }
    };
    this.moveRight = (e) => {
      const group = this.slottedRadioButtons;
      let index = 0;
      index = this.focusedRadio ? group.indexOf(this.focusedRadio) + 1 : 1;
      if (this.shouldMoveOffGroupToTheRight(index, group, e.key)) {
        this.moveRightOffGroup();
        return;
      } else if (index === group.length) {
        index = 0;
      }
      while (index < group.length && group.length > 1) {
        if (!group[index].disabled) {
          this.moveToRadioByIndex(group, index);
          break;
        } else if (this.focusedRadio && index === group.indexOf(this.focusedRadio)) {
          break;
        } else if (index + 1 >= group.length) {
          if (this.isInsideToolbar) {
            break;
          } else {
            index = 0;
          }
        } else {
          index += 1;
        }
      }
    };
    this.moveLeft = (e) => {
      const group = this.slottedRadioButtons;
      let index = 0;
      index = this.focusedRadio ? group.indexOf(this.focusedRadio) - 1 : 0;
      index = index < 0 ? group.length - 1 : index;
      if (this.shouldMoveOffGroupToTheLeft(group, e.key)) {
        this.moveLeftOffGroup();
        return;
      }
      while (index >= 0 && group.length > 1) {
        if (!group[index].disabled) {
          this.moveToRadioByIndex(group, index);
          break;
        } else if (this.focusedRadio && index === group.indexOf(this.focusedRadio)) {
          break;
        } else if (index - 1 < 0) {
          index = group.length - 1;
        } else {
          index -= 1;
        }
      }
    };
    this.keydownHandler = (e) => {
      const key = e.key;
      if (key in ArrowKeys && this.isInsideFoundationToolbar) {
        return true;
      }
      switch (key) {
        case keyEnter: {
          this.checkFocusedRadio();
          break;
        }
        case keyArrowRight:
        case keyArrowDown: {
          if (this.direction === Direction.ltr) {
            this.moveRight(e);
          } else {
            this.moveLeft(e);
          }
          break;
        }
        case keyArrowLeft:
        case keyArrowUp: {
          if (this.direction === Direction.ltr) {
            this.moveLeft(e);
          } else {
            this.moveRight(e);
          }
          break;
        }
        default: {
          return true;
        }
      }
    };
  }
  readOnlyChanged() {
    if (this.slottedRadioButtons !== void 0) {
      this.slottedRadioButtons.forEach((radio) => {
        if (this.readOnly) {
          radio.readOnly = true;
        } else {
          radio.readOnly = false;
        }
      });
    }
  }
  disabledChanged() {
    if (this.slottedRadioButtons !== void 0) {
      this.slottedRadioButtons.forEach((radio) => {
        if (this.disabled) {
          radio.disabled = true;
        } else {
          radio.disabled = false;
        }
      });
    }
  }
  nameChanged() {
    if (this.slottedRadioButtons) {
      this.slottedRadioButtons.forEach((radio) => {
        radio.setAttribute("name", this.name);
      });
    }
  }
  valueChanged() {
    if (this.slottedRadioButtons) {
      this.slottedRadioButtons.forEach((radio) => {
        if (radio.value === this.value) {
          radio.checked = true;
          this.selectedRadio = radio;
        }
      });
    }
    this.$emit("change");
  }
  slottedRadioButtonsChanged(oldValue, newValue) {
    if (this.slottedRadioButtons && this.slottedRadioButtons.length > 0) {
      this.setupRadioButtons();
    }
  }
  get parentToolbar() {
    return this.closest('[role="toolbar"]');
  }
  get isInsideToolbar() {
    var _a;
    return (_a = this.parentToolbar) !== null && _a !== void 0 ? _a : false;
  }
  get isInsideFoundationToolbar() {
    var _a;
    return !!((_a = this.parentToolbar) === null || _a === void 0 ? void 0 : _a["$fastController"]);
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.direction = getDirection(this);
    this.setupRadioButtons();
  }
  disconnectedCallback() {
    this.slottedRadioButtons.forEach((radio) => {
      radio.removeEventListener("change", this.radioChangeHandler);
    });
  }
  setupRadioButtons() {
    const checkedRadios = this.slottedRadioButtons.filter((radio) => {
      return radio.hasAttribute("checked");
    });
    const numberOfCheckedRadios = checkedRadios ? checkedRadios.length : 0;
    if (numberOfCheckedRadios > 1) {
      const lastCheckedRadio = checkedRadios[numberOfCheckedRadios - 1];
      lastCheckedRadio.checked = true;
    }
    let foundMatchingVal = false;
    this.slottedRadioButtons.forEach((radio) => {
      if (this.name !== void 0) {
        radio.setAttribute("name", this.name);
      }
      if (this.disabled) {
        radio.disabled = true;
      }
      if (this.readOnly) {
        radio.readOnly = true;
      }
      if (this.value && this.value === radio.value) {
        this.selectedRadio = radio;
        this.focusedRadio = radio;
        radio.checked = true;
        radio.setAttribute("tabindex", "0");
        foundMatchingVal = true;
      } else {
        if (!this.isInsideFoundationToolbar) {
          radio.setAttribute("tabindex", "-1");
        }
        radio.checked = false;
      }
      radio.addEventListener("change", this.radioChangeHandler);
    });
    if (this.value === void 0 && this.slottedRadioButtons.length > 0) {
      const checkedRadios2 = this.slottedRadioButtons.filter((radio) => {
        return radio.hasAttribute("checked");
      });
      const numberOfCheckedRadios2 = checkedRadios2 !== null ? checkedRadios2.length : 0;
      if (numberOfCheckedRadios2 > 0 && !foundMatchingVal) {
        const lastCheckedRadio = checkedRadios2[numberOfCheckedRadios2 - 1];
        lastCheckedRadio.checked = true;
        this.focusedRadio = lastCheckedRadio;
        lastCheckedRadio.setAttribute("tabindex", "0");
      } else {
        this.slottedRadioButtons[0].setAttribute("tabindex", "0");
        this.focusedRadio = this.slottedRadioButtons[0];
      }
    }
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], RadioGroup.prototype, "readOnly", void 0);
__decorate([
  attr({ attribute: "disabled", mode: "boolean" })
], RadioGroup.prototype, "disabled", void 0);
__decorate([
  attr
], RadioGroup.prototype, "name", void 0);
__decorate([
  attr
], RadioGroup.prototype, "value", void 0);
__decorate([
  attr
], RadioGroup.prototype, "orientation", void 0);
__decorate([
  observable
], RadioGroup.prototype, "childItems", void 0);
__decorate([
  observable
], RadioGroup.prototype, "slottedRadioButtons", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/radio/radio.template.js
var radioTemplate = (context, definition) => html2`
    <template
        role="radio"
        class="${(x) => x.checked ? "checked" : ""} ${(x) => x.readOnly ? "readonly" : ""}"
        aria-checked="${(x) => x.checked}"
        aria-required="${(x) => x.required}"
        aria-disabled="${(x) => x.disabled}"
        aria-readonly="${(x) => x.readOnly}"
        @keypress="${(x, c) => x.keypressHandler(c.event)}"
        @click="${(x, c) => x.clickHandler(c.event)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${definition.checkedIndicator || ""}
            </slot>
        </div>
        <label
            part="label"
            class="${(x) => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/radio/radio.form-associated.js
var _Radio = class extends FoundationElement {
};
var FormAssociatedRadio = class extends CheckableFormAssociated(_Radio) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/radio/radio.js
var Radio = class extends FormAssociatedRadio {
  constructor() {
    super();
    this.initialValue = "on";
    this.keypressHandler = (e) => {
      switch (e.key) {
        case keySpace:
          if (!this.checked && !this.readOnly) {
            this.checked = true;
          }
          return;
      }
      return true;
    };
    this.proxy.setAttribute("type", "radio");
  }
  readOnlyChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.readOnly = this.readOnly;
    }
  }
  /**
   * @internal
   */
  defaultCheckedChanged() {
    var _a;
    if (this.$fastController.isConnected && !this.dirtyChecked) {
      if (!this.isInsideRadioGroup()) {
        this.checked = (_a = this.defaultChecked) !== null && _a !== void 0 ? _a : false;
        this.dirtyChecked = false;
      }
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    var _a, _b;
    super.connectedCallback();
    this.validate();
    if (((_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute("role")) !== "radiogroup" && this.getAttribute("tabindex") === null) {
      if (!this.disabled) {
        this.setAttribute("tabindex", "0");
      }
    }
    if (this.checkedAttribute) {
      if (!this.dirtyChecked) {
        if (!this.isInsideRadioGroup()) {
          this.checked = (_b = this.defaultChecked) !== null && _b !== void 0 ? _b : false;
          this.dirtyChecked = false;
        }
      }
    }
  }
  isInsideRadioGroup() {
    const parent = this.closest("[role=radiogroup]");
    return parent !== null;
  }
  /**
   * @internal
   */
  clickHandler(e) {
    if (!this.disabled && !this.readOnly && !this.checked) {
      this.checked = true;
    }
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], Radio.prototype, "readOnly", void 0);
__decorate([
  observable
], Radio.prototype, "name", void 0);
__decorate([
  observable
], Radio.prototype, "defaultSlottedNodes", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/horizontal-scroll/horizontal-scroll.js
var HorizontalScroll = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.framesPerSecond = 60;
    this.updatingItems = false;
    this.speed = 600;
    this.easing = "ease-in-out";
    this.flippersHiddenFromAT = false;
    this.scrolling = false;
    this.resizeDetector = null;
  }
  /**
   * The calculated duration for a frame.
   *
   * @internal
   */
  get frameTime() {
    return 1e3 / this.framesPerSecond;
  }
  /**
   * Firing scrollstart and scrollend events
   * @internal
   */
  scrollingChanged(prev, next) {
    if (this.scrollContainer) {
      const event = this.scrolling == true ? "scrollstart" : "scrollend";
      this.$emit(event, this.scrollContainer.scrollLeft);
    }
  }
  /**
   * In RTL mode
   * @internal
   */
  get isRtl() {
    return this.scrollItems.length > 1 && this.scrollItems[0].offsetLeft > this.scrollItems[1].offsetLeft;
  }
  connectedCallback() {
    super.connectedCallback();
    this.initializeResizeDetector();
  }
  disconnectedCallback() {
    this.disconnectResizeDetector();
    super.disconnectedCallback();
  }
  /**
   * Updates scroll stops and flippers when scroll items change
   * @param previous - current scroll items
   * @param next - new updated scroll items
   * @public
   */
  scrollItemsChanged(previous, next) {
    if (next && !this.updatingItems) {
      DOM.queueUpdate(() => this.setStops());
    }
  }
  /**
   * destroys the instance's resize observer
   * @internal
   */
  disconnectResizeDetector() {
    if (this.resizeDetector) {
      this.resizeDetector.disconnect();
      this.resizeDetector = null;
    }
  }
  /**
   * initializes the instance's resize observer
   * @internal
   */
  initializeResizeDetector() {
    this.disconnectResizeDetector();
    this.resizeDetector = new window.ResizeObserver(this.resized.bind(this));
    this.resizeDetector.observe(this);
  }
  /**
   * Looks for slots and uses child nodes instead
   * @internal
   */
  updateScrollStops() {
    this.updatingItems = true;
    const updatedItems = this.scrollItems.reduce((scrollItems, scrollItem) => {
      if (scrollItem instanceof HTMLSlotElement) {
        return scrollItems.concat(scrollItem.assignedElements());
      }
      scrollItems.push(scrollItem);
      return scrollItems;
    }, []);
    this.scrollItems = updatedItems;
    this.updatingItems = false;
  }
  /**
   * Finds all of the scroll stops between elements
   * @internal
   */
  setStops() {
    this.updateScrollStops();
    const { scrollContainer: container } = this;
    const { scrollLeft } = container;
    const { width: containerWidth, left: containerLeft } = container.getBoundingClientRect();
    this.width = containerWidth;
    let lastStop = 0;
    let stops = this.scrollItems.map((item, index) => {
      const { left, width } = item.getBoundingClientRect();
      const leftPosition = Math.round(left + scrollLeft - containerLeft);
      const right = Math.round(leftPosition + width);
      if (this.isRtl) {
        return -right;
      }
      lastStop = right;
      return index === 0 ? 0 : leftPosition;
    }).concat(lastStop);
    stops = this.fixScrollMisalign(stops);
    stops.sort((a, b) => Math.abs(a) - Math.abs(b));
    this.scrollStops = stops;
    this.setFlippers();
  }
  /**
   * Checks to see if the stops are returning values
   *  otherwise it will try to reinitialize them
   *
   * @returns boolean indicating that current scrollStops are valid non-zero values
   * @internal
   */
  validateStops(reinit = true) {
    const hasStops = () => !!this.scrollStops.find((stop) => stop > 0);
    if (!hasStops() && reinit) {
      this.setStops();
    }
    return hasStops();
  }
  /**
   *
   */
  fixScrollMisalign(stops) {
    if (this.isRtl && stops.some((stop) => stop > 0)) {
      stops.sort((a, b) => b - a);
      const offset = stops[0];
      stops = stops.map((stop) => stop - offset);
    }
    return stops;
  }
  /**
   * Sets the controls view if enabled
   * @internal
   */
  setFlippers() {
    var _a, _b;
    const position = this.scrollContainer.scrollLeft;
    (_a = this.previousFlipperContainer) === null || _a === void 0 ? void 0 : _a.classList.toggle("disabled", position === 0);
    if (this.scrollStops) {
      const lastStop = Math.abs(this.scrollStops[this.scrollStops.length - 1]);
      (_b = this.nextFlipperContainer) === null || _b === void 0 ? void 0 : _b.classList.toggle("disabled", this.validateStops(false) && Math.abs(position) + this.width >= lastStop);
    }
  }
  /**
   * Function that can scroll an item into view.
   * @param item - An item index, a scroll item or a child of one of the scroll items
   * @param padding - Padding of the viewport where the active item shouldn't be
   * @param rightPadding - Optional right padding. Uses the padding if not defined
   *
   * @public
   */
  scrollInView(item, padding = 0, rightPadding) {
    var _a;
    if (typeof item !== "number" && item) {
      item = this.scrollItems.findIndex((scrollItem) => scrollItem === item || scrollItem.contains(item));
    }
    if (item !== void 0) {
      rightPadding = rightPadding !== null && rightPadding !== void 0 ? rightPadding : padding;
      const { scrollContainer: container, scrollStops, scrollItems: items } = this;
      const { scrollLeft } = this.scrollContainer;
      const { width: containerWidth } = container.getBoundingClientRect();
      const itemStart = scrollStops[item];
      const { width } = items[item].getBoundingClientRect();
      const itemEnd = itemStart + width;
      const isBefore = scrollLeft + padding > itemStart;
      if (isBefore || scrollLeft + containerWidth - rightPadding < itemEnd) {
        const stops = [...scrollStops].sort((a, b) => isBefore ? b - a : a - b);
        const scrollTo = (_a = stops.find((position) => isBefore ? position + padding < itemStart : position + containerWidth - (rightPadding !== null && rightPadding !== void 0 ? rightPadding : 0) > itemEnd)) !== null && _a !== void 0 ? _a : 0;
        this.scrollToPosition(scrollTo);
      }
    }
  }
  /**
   * Lets the user arrow left and right through the horizontal scroll
   * @param e - Keyboard event
   * @public
   */
  keyupHandler(e) {
    const key = e.key;
    switch (key) {
      case "ArrowLeft":
        this.scrollToPrevious();
        break;
      case "ArrowRight":
        this.scrollToNext();
        break;
    }
  }
  /**
   * Scrolls items to the left
   * @public
   */
  scrollToPrevious() {
    this.validateStops();
    const scrollPosition = this.scrollContainer.scrollLeft;
    const current = this.scrollStops.findIndex((stop, index) => stop >= scrollPosition && (this.isRtl || index === this.scrollStops.length - 1 || this.scrollStops[index + 1] > scrollPosition));
    const right = Math.abs(this.scrollStops[current + 1]);
    let nextIndex = this.scrollStops.findIndex((stop) => Math.abs(stop) + this.width > right);
    if (nextIndex >= current || nextIndex === -1) {
      nextIndex = current > 0 ? current - 1 : 0;
    }
    this.scrollToPosition(this.scrollStops[nextIndex], scrollPosition);
  }
  /**
   * Scrolls items to the right
   * @public
   */
  scrollToNext() {
    this.validateStops();
    const scrollPosition = this.scrollContainer.scrollLeft;
    const current = this.scrollStops.findIndex((stop) => Math.abs(stop) >= Math.abs(scrollPosition));
    const outOfView = this.scrollStops.findIndex((stop) => Math.abs(scrollPosition) + this.width <= Math.abs(stop));
    let nextIndex = current;
    if (outOfView > current + 2) {
      nextIndex = outOfView - 2;
    } else if (current < this.scrollStops.length - 2) {
      nextIndex = current + 1;
    }
    this.scrollToPosition(this.scrollStops[nextIndex], scrollPosition);
  }
  /**
   * Handles scrolling with easing
   * @param position - starting position
   * @param newPosition - position to scroll to
   * @public
   */
  scrollToPosition(newPosition, position = this.scrollContainer.scrollLeft) {
    var _a;
    if (this.scrolling) {
      return;
    }
    this.scrolling = true;
    const seconds = (_a = this.duration) !== null && _a !== void 0 ? _a : `${Math.abs(newPosition - position) / this.speed}s`;
    this.content.style.setProperty("transition-duration", seconds);
    const computedDuration = parseFloat(getComputedStyle(this.content).getPropertyValue("transition-duration"));
    const transitionendHandler = (e) => {
      if (e && e.target !== e.currentTarget) {
        return;
      }
      this.content.style.setProperty("transition-duration", "0s");
      this.content.style.removeProperty("transform");
      this.scrollContainer.style.setProperty("scroll-behavior", "auto");
      this.scrollContainer.scrollLeft = newPosition;
      this.setFlippers();
      this.content.removeEventListener("transitionend", transitionendHandler);
      this.scrolling = false;
    };
    if (computedDuration === 0) {
      transitionendHandler();
      return;
    }
    this.content.addEventListener("transitionend", transitionendHandler);
    const maxScrollValue = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
    let transitionStop = this.scrollContainer.scrollLeft - Math.min(newPosition, maxScrollValue);
    if (this.isRtl) {
      transitionStop = this.scrollContainer.scrollLeft + Math.min(Math.abs(newPosition), maxScrollValue);
    }
    this.content.style.setProperty("transition-property", "transform");
    this.content.style.setProperty("transition-timing-function", this.easing);
    this.content.style.setProperty("transform", `translateX(${transitionStop}px)`);
  }
  /**
   * Monitors resize event on the horizontal-scroll element
   * @public
   */
  resized() {
    if (this.resizeTimeout) {
      this.resizeTimeout = clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.width = this.scrollContainer.offsetWidth;
      this.setFlippers();
    }, this.frameTime);
  }
  /**
   * Monitors scrolled event on the content container
   * @public
   */
  scrolled() {
    if (this.scrollTimeout) {
      this.scrollTimeout = clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.setFlippers();
    }, this.frameTime);
  }
};
__decorate([
  attr({ converter: nullableNumberConverter })
], HorizontalScroll.prototype, "speed", void 0);
__decorate([
  attr
], HorizontalScroll.prototype, "duration", void 0);
__decorate([
  attr
], HorizontalScroll.prototype, "easing", void 0);
__decorate([
  attr({ attribute: "flippers-hidden-from-at", converter: booleanConverter })
], HorizontalScroll.prototype, "flippersHiddenFromAT", void 0);
__decorate([
  observable
], HorizontalScroll.prototype, "scrolling", void 0);
__decorate([
  observable
], HorizontalScroll.prototype, "scrollItems", void 0);
__decorate([
  attr({ attribute: "view" })
], HorizontalScroll.prototype, "view", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/horizontal-scroll/horizontal-scroll.template.js
var horizontalScrollTemplate = (context, definition) => {
  var _a, _b;
  return html2`
    <template
        class="horizontal-scroll"
        @keyup="${(x, c) => x.keyupHandler(c.event)}"
    >
        ${startSlotTemplate(context, definition)}
        <div class="scroll-area" part="scroll-area">
            <div
                class="scroll-view"
                part="scroll-view"
                @scroll="${(x) => x.scrolled()}"
                ${ref("scrollContainer")}
            >
                <div class="content-container" part="content-container" ${ref("content")}>
                    <slot
                        ${slotted({
    property: "scrollItems",
    filter: elements()
  })}
                    ></slot>
                </div>
            </div>
            ${when((x) => x.view !== "mobile", html2`
                    <div
                        class="scroll scroll-prev"
                        part="scroll-prev"
                        ${ref("previousFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-previous">
                            <slot name="previous-flipper">
                                ${definition.previousFlipper instanceof Function ? definition.previousFlipper(context, definition) : (_a = definition.previousFlipper) !== null && _a !== void 0 ? _a : ""}
                            </slot>
                        </div>
                    </div>
                    <div
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${ref("nextFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-next">
                            <slot name="next-flipper">
                                ${definition.nextFlipper instanceof Function ? definition.nextFlipper(context, definition) : (_b = definition.nextFlipper) !== null && _b !== void 0 ? _b : ""}
                            </slot>
                        </div>
                    </div>
                `)}
        </div>
        ${endSlotTemplate(context, definition)}
    </template>
`;
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/whitespace-filter.js
function whitespaceFilter(value, index, array) {
  return value.nodeType !== Node.TEXT_NODE ? true : typeof value.nodeValue === "string" && !!value.nodeValue.trim().length;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/search/search.form-associated.js
var _Search = class extends FoundationElement {
};
var FormAssociatedSearch = class extends FormAssociated(_Search) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/search/search.js
var Search = class extends FormAssociatedSearch {
  readOnlyChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.readOnly = this.readOnly;
      this.validate();
    }
  }
  autofocusChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.autofocus = this.autofocus;
      this.validate();
    }
  }
  placeholderChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.placeholder = this.placeholder;
    }
  }
  listChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.setAttribute("list", this.list);
      this.validate();
    }
  }
  maxlengthChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.maxLength = this.maxlength;
      this.validate();
    }
  }
  minlengthChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.minLength = this.minlength;
      this.validate();
    }
  }
  patternChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.pattern = this.pattern;
      this.validate();
    }
  }
  sizeChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.size = this.size;
    }
  }
  spellcheckChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.spellcheck = this.spellcheck;
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.validate();
    if (this.autofocus) {
      DOM.queueUpdate(() => {
        this.focus();
      });
    }
  }
  /** {@inheritDoc (FormAssociated:interface).validate} */
  validate() {
    super.validate(this.control);
  }
  /**
   * Handles the internal control's `input` event
   * @internal
   */
  handleTextInput() {
    this.value = this.control.value;
  }
  /**
   * Handles the control's clear value event
   * @public
   */
  handleClearInput() {
    this.value = "";
    this.control.focus();
    this.handleChange();
  }
  /**
   * Change event handler for inner control.
   * @remarks
   * "Change" events are not `composable` so they will not
   * permeate the shadow DOM boundary. This fn effectively proxies
   * the change event, emitting a `change` event whenever the internal
   * control emits a `change` event
   * @internal
   */
  handleChange() {
    this.$emit("change");
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], Search.prototype, "readOnly", void 0);
__decorate([
  attr({ mode: "boolean" })
], Search.prototype, "autofocus", void 0);
__decorate([
  attr
], Search.prototype, "placeholder", void 0);
__decorate([
  attr
], Search.prototype, "list", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Search.prototype, "maxlength", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Search.prototype, "minlength", void 0);
__decorate([
  attr
], Search.prototype, "pattern", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Search.prototype, "size", void 0);
__decorate([
  attr({ mode: "boolean" })
], Search.prototype, "spellcheck", void 0);
__decorate([
  observable
], Search.prototype, "defaultSlottedNodes", void 0);
var DelegatesARIASearch = class {
};
applyMixins(DelegatesARIASearch, ARIAGlobalStatesAndProperties);
applyMixins(Search, StartEnd, DelegatesARIASearch);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/select/select.form-associated.js
var _Select = class extends ListboxElement {
};
var FormAssociatedSelect = class extends FormAssociated(_Select) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("select");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/select/select.js
var Select = class extends FormAssociatedSelect {
  constructor() {
    super(...arguments);
    this.open = false;
    this.forcedPosition = false;
    this.listboxId = uniqueId("listbox-");
    this.maxHeight = 0;
  }
  /**
   * Sets focus and synchronizes ARIA attributes when the open property changes.
   *
   * @param prev - the previous open value
   * @param next - the current open value
   *
   * @internal
   */
  openChanged(prev, next) {
    if (!this.collapsible) {
      return;
    }
    if (this.open) {
      this.ariaControls = this.listboxId;
      this.ariaExpanded = "true";
      this.setPositioning();
      this.focusAndScrollOptionIntoView();
      this.indexWhenOpened = this.selectedIndex;
      DOM.queueUpdate(() => this.focus());
      return;
    }
    this.ariaControls = "";
    this.ariaExpanded = "false";
  }
  /**
   * The component is collapsible when in single-selection mode with no size attribute.
   *
   * @internal
   */
  get collapsible() {
    return !(this.multiple || typeof this.size === "number");
  }
  /**
   * The value property.
   *
   * @public
   */
  get value() {
    Observable.track(this, "value");
    return this._value;
  }
  set value(next) {
    var _a, _b, _c, _d, _e, _f, _g;
    const prev = `${this._value}`;
    if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.length) {
      const selectedIndex = this._options.findIndex((el) => el.value === next);
      const prevSelectedValue = (_c = (_b = this._options[this.selectedIndex]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : null;
      const nextSelectedValue = (_e = (_d = this._options[selectedIndex]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : null;
      if (selectedIndex === -1 || prevSelectedValue !== nextSelectedValue) {
        next = "";
        this.selectedIndex = selectedIndex;
      }
      next = (_g = (_f = this.firstSelectedOption) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : next;
    }
    if (prev !== next) {
      this._value = next;
      super.valueChanged(prev, next);
      Observable.notify(this, "value");
      this.updateDisplayValue();
    }
  }
  /**
   * Sets the value and display value to match the first selected option.
   *
   * @param shouldEmit - if true, the input and change events will be emitted
   *
   * @internal
   */
  updateValue(shouldEmit) {
    var _a, _b;
    if (this.$fastController.isConnected) {
      this.value = (_b = (_a = this.firstSelectedOption) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
    }
    if (shouldEmit) {
      this.$emit("input");
      this.$emit("change", this, {
        bubbles: true,
        composed: void 0
      });
    }
  }
  /**
   * Updates the proxy value when the selected index changes.
   *
   * @param prev - the previous selected index
   * @param next - the next selected index
   *
   * @internal
   */
  selectedIndexChanged(prev, next) {
    super.selectedIndexChanged(prev, next);
    this.updateValue();
  }
  positionChanged(prev, next) {
    this.positionAttribute = next;
    this.setPositioning();
  }
  /**
   * Calculate and apply listbox positioning based on available viewport space.
   *
   * @public
   */
  setPositioning() {
    const currentBox = this.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const availableBottom = viewportHeight - currentBox.bottom;
    this.position = this.forcedPosition ? this.positionAttribute : currentBox.top > availableBottom ? SelectPosition.above : SelectPosition.below;
    this.positionAttribute = this.forcedPosition ? this.positionAttribute : this.position;
    this.maxHeight = this.position === SelectPosition.above ? ~~currentBox.top : ~~availableBottom;
  }
  /**
   * The value displayed on the button.
   *
   * @public
   */
  get displayValue() {
    var _a, _b;
    Observable.track(this, "displayValue");
    return (_b = (_a = this.firstSelectedOption) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
  }
  /**
   * Synchronize the `aria-disabled` property when the `disabled` property changes.
   *
   * @param prev - The previous disabled value
   * @param next - The next disabled value
   *
   * @internal
   */
  disabledChanged(prev, next) {
    if (super.disabledChanged) {
      super.disabledChanged(prev, next);
    }
    this.ariaDisabled = this.disabled ? "true" : "false";
  }
  /**
   * Reset the element to its first selectable option when its parent form is reset.
   *
   * @internal
   */
  formResetCallback() {
    this.setProxyOptions();
    super.setDefaultSelectedOption();
    if (this.selectedIndex === -1) {
      this.selectedIndex = 0;
    }
  }
  /**
   * Handle opening and closing the listbox when the select is clicked.
   *
   * @param e - the mouse event
   * @internal
   */
  clickHandler(e) {
    if (this.disabled) {
      return;
    }
    if (this.open) {
      const captured = e.target.closest(`option,[role=option]`);
      if (captured && captured.disabled) {
        return;
      }
    }
    super.clickHandler(e);
    this.open = this.collapsible && !this.open;
    if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
      this.updateValue(true);
    }
    return true;
  }
  /**
   * Handles focus state when the element or its children lose focus.
   *
   * @param e - The focus event
   * @internal
   */
  focusoutHandler(e) {
    var _a;
    super.focusoutHandler(e);
    if (!this.open) {
      return true;
    }
    const focusTarget = e.relatedTarget;
    if (this.isSameNode(focusTarget)) {
      this.focus();
      return;
    }
    if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.includes(focusTarget))) {
      this.open = false;
      if (this.indexWhenOpened !== this.selectedIndex) {
        this.updateValue(true);
      }
    }
  }
  /**
   * Updates the value when an option's value changes.
   *
   * @param source - the source object
   * @param propertyName - the property to evaluate
   *
   * @internal
   * @override
   */
  handleChange(source, propertyName) {
    super.handleChange(source, propertyName);
    if (propertyName === "value") {
      this.updateValue();
    }
  }
  /**
   * Synchronize the form-associated proxy and updates the value property of the element.
   *
   * @param prev - the previous collection of slotted option elements
   * @param next - the next collection of slotted option elements
   *
   * @internal
   */
  slottedOptionsChanged(prev, next) {
    this.options.forEach((o) => {
      const notifier = Observable.getNotifier(o);
      notifier.unsubscribe(this, "value");
    });
    super.slottedOptionsChanged(prev, next);
    this.options.forEach((o) => {
      const notifier = Observable.getNotifier(o);
      notifier.subscribe(this, "value");
    });
    this.setProxyOptions();
    this.updateValue();
  }
  /**
   * Prevents focus when size is set and a scrollbar is clicked.
   *
   * @param e - the mouse event object
   *
   * @override
   * @internal
   */
  mousedownHandler(e) {
    var _a;
    if (e.offsetX >= 0 && e.offsetX <= ((_a = this.listbox) === null || _a === void 0 ? void 0 : _a.scrollWidth)) {
      return super.mousedownHandler(e);
    }
    return this.collapsible;
  }
  /**
   * Sets the multiple property on the proxy element.
   *
   * @param prev - the previous multiple value
   * @param next - the current multiple value
   */
  multipleChanged(prev, next) {
    super.multipleChanged(prev, next);
    if (this.proxy) {
      this.proxy.multiple = next;
    }
  }
  /**
   * Updates the selectedness of each option when the list of selected options changes.
   *
   * @param prev - the previous list of selected options
   * @param next - the current list of selected options
   *
   * @override
   * @internal
   */
  selectedOptionsChanged(prev, next) {
    var _a;
    super.selectedOptionsChanged(prev, next);
    (_a = this.options) === null || _a === void 0 ? void 0 : _a.forEach((o, i) => {
      var _a2;
      const proxyOption = (_a2 = this.proxy) === null || _a2 === void 0 ? void 0 : _a2.options.item(i);
      if (proxyOption) {
        proxyOption.selected = o.selected;
      }
    });
  }
  /**
   * Sets the selected index to match the first option with the selected attribute, or
   * the first selectable option.
   *
   * @override
   * @internal
   */
  setDefaultSelectedOption() {
    var _a;
    const options = (_a = this.options) !== null && _a !== void 0 ? _a : Array.from(this.children).filter(Listbox.slottedOptionFilter);
    const selectedIndex = options === null || options === void 0 ? void 0 : options.findIndex((el) => el.hasAttribute("selected") || el.selected || el.value === this.value);
    if (selectedIndex !== -1) {
      this.selectedIndex = selectedIndex;
      return;
    }
    this.selectedIndex = 0;
  }
  /**
   * Resets and fills the proxy to match the component's options.
   *
   * @internal
   */
  setProxyOptions() {
    if (this.proxy instanceof HTMLSelectElement && this.options) {
      this.proxy.options.length = 0;
      this.options.forEach((option) => {
        const proxyOption = option.proxy || (option instanceof HTMLOptionElement ? option.cloneNode() : null);
        if (proxyOption) {
          this.proxy.options.add(proxyOption);
        }
      });
    }
  }
  /**
   * Handle keyboard interaction for the select.
   *
   * @param e - the keyboard event
   * @internal
   */
  keydownHandler(e) {
    super.keydownHandler(e);
    const key = e.key || e.key.charCodeAt(0);
    switch (key) {
      case keySpace: {
        e.preventDefault();
        if (this.collapsible && this.typeAheadExpired) {
          this.open = !this.open;
        }
        break;
      }
      case keyHome:
      case keyEnd: {
        e.preventDefault();
        break;
      }
      case keyEnter: {
        e.preventDefault();
        this.open = !this.open;
        break;
      }
      case keyEscape: {
        if (this.collapsible && this.open) {
          e.preventDefault();
          this.open = false;
        }
        break;
      }
      case keyTab: {
        if (this.collapsible && this.open) {
          e.preventDefault();
          this.open = false;
        }
        return true;
      }
    }
    if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
      this.updateValue(true);
      this.indexWhenOpened = this.selectedIndex;
    }
    return !(key === keyArrowDown || key === keyArrowUp);
  }
  connectedCallback() {
    super.connectedCallback();
    this.forcedPosition = !!this.positionAttribute;
    this.addEventListener("contentchange", this.updateDisplayValue);
  }
  disconnectedCallback() {
    this.removeEventListener("contentchange", this.updateDisplayValue);
    super.disconnectedCallback();
  }
  /**
   * Updates the proxy's size property when the size attribute changes.
   *
   * @param prev - the previous size
   * @param next - the current size
   *
   * @override
   * @internal
   */
  sizeChanged(prev, next) {
    super.sizeChanged(prev, next);
    if (this.proxy) {
      this.proxy.size = next;
    }
  }
  /**
   *
   * @internal
   */
  updateDisplayValue() {
    if (this.collapsible) {
      Observable.notify(this, "displayValue");
    }
  }
};
__decorate([
  attr({ attribute: "open", mode: "boolean" })
], Select.prototype, "open", void 0);
__decorate([
  volatile
], Select.prototype, "collapsible", null);
__decorate([
  observable
], Select.prototype, "control", void 0);
__decorate([
  attr({ attribute: "position" })
], Select.prototype, "positionAttribute", void 0);
__decorate([
  observable
], Select.prototype, "position", void 0);
__decorate([
  observable
], Select.prototype, "maxHeight", void 0);
var DelegatesARIASelect = class {
};
__decorate([
  observable
], DelegatesARIASelect.prototype, "ariaControls", void 0);
applyMixins(DelegatesARIASelect, DelegatesARIAListbox);
applyMixins(Select, StartEnd, DelegatesARIASelect);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/select/select.template.js
var selectTemplate = (context, definition) => html2`
    <template
        class="${(x) => [
  x.collapsible && "collapsible",
  x.collapsible && x.open && "open",
  x.disabled && "disabled",
  x.collapsible && x.position
].filter(Boolean).join(" ")}"
        aria-activedescendant="${(x) => x.ariaActiveDescendant}"
        aria-controls="${(x) => x.ariaControls}"
        aria-disabled="${(x) => x.ariaDisabled}"
        aria-expanded="${(x) => x.ariaExpanded}"
        aria-haspopup="${(x) => x.collapsible ? "listbox" : null}"
        aria-multiselectable="${(x) => x.ariaMultiSelectable}"
        ?open="${(x) => x.open}"
        role="combobox"
        tabindex="${(x) => !x.disabled ? "0" : null}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        @focusin="${(x, c) => x.focusinHandler(c.event)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event)}"
        @keydown="${(x, c) => x.keydownHandler(c.event)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event)}"
    >
        ${when((x) => x.collapsible, html2`
                <div
                    class="control"
                    part="control"
                    ?disabled="${(x) => x.disabled}"
                    ${ref("control")}
                >
                    ${startSlotTemplate(context, definition)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${(x) => x.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${definition.indicator || ""}
                            </slot>
                        </div>
                    </slot>
                    ${endSlotTemplate(context, definition)}
                </div>
            `)}
        <div
            class="listbox"
            id="${(x) => x.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${(x) => x.disabled}"
            ?hidden="${(x) => x.collapsible ? !x.open : false}"
            ${ref("listbox")}
        >
            <slot
                ${slotted({
  filter: Listbox.slottedOptionFilter,
  flatten: true,
  property: "slottedOptions"
})}
            ></slot>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/skeleton/skeleton.template.js
var skeletonTemplate = (context, definition) => html2`
    <template
        class="${(x) => x.shape === "circle" ? "circle" : "rect"}"
        pattern="${(x) => x.pattern}"
        ?shimmer="${(x) => x.shimmer}"
    >
        ${when((x) => x.shimmer === true, html2`
                <span class="shimmer"></span>
            `)}
        <object type="image/svg+xml" data="${(x) => x.pattern}" role="presentation">
            <img class="pattern" src="${(x) => x.pattern}" />
        </object>
        <slot></slot>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/skeleton/skeleton.js
var Skeleton = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.shape = "rect";
  }
};
__decorate([
  attr
], Skeleton.prototype, "fill", void 0);
__decorate([
  attr
], Skeleton.prototype, "shape", void 0);
__decorate([
  attr
], Skeleton.prototype, "pattern", void 0);
__decorate([
  attr({ mode: "boolean" })
], Skeleton.prototype, "shimmer", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/slider-label/slider-label.template.js
var sliderLabelTemplate = (context, definition) => html2`
    <template
        aria-disabled="${(x) => x.disabled}"
        class="${(x) => x.sliderOrientation || Orientation.horizontal}
            ${(x) => x.disabled ? "disabled" : ""}"
    >
        <div ${ref("root")} part="root" class="root" style="${(x) => x.positionStyle}">
            <div class="container">
                ${when((x) => !x.hideMark, html2`
                        <div class="mark"></div>
                    `)}
                <div class="label">
                    <slot></slot>
                </div>
            </div>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/slider/slider-utilities.js
function convertPixelToPercent(pixelPos, minPosition, maxPosition, direction2) {
  let pct = limit(0, 1, (pixelPos - minPosition) / (maxPosition - minPosition));
  if (direction2 === Direction.rtl) {
    pct = 1 - pct;
  }
  return pct;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/slider-label/slider-label.js
var defaultConfig = {
  min: 0,
  max: 0,
  direction: Direction.ltr,
  orientation: Orientation.horizontal,
  disabled: false
};
var SliderLabel = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.hideMark = false;
    this.sliderDirection = Direction.ltr;
    this.getSliderConfiguration = () => {
      if (!this.isSliderConfig(this.parentNode)) {
        this.sliderDirection = defaultConfig.direction || Direction.ltr;
        this.sliderOrientation = defaultConfig.orientation || Orientation.horizontal;
        this.sliderMaxPosition = defaultConfig.max;
        this.sliderMinPosition = defaultConfig.min;
      } else {
        const parentSlider = this.parentNode;
        const { min, max, direction: direction2, orientation, disabled } = parentSlider;
        if (disabled !== void 0) {
          this.disabled = disabled;
        }
        this.sliderDirection = direction2 || Direction.ltr;
        this.sliderOrientation = orientation || Orientation.horizontal;
        this.sliderMaxPosition = max;
        this.sliderMinPosition = min;
      }
    };
    this.positionAsStyle = () => {
      const direction2 = this.sliderDirection ? this.sliderDirection : Direction.ltr;
      const pct = convertPixelToPercent(Number(this.position), Number(this.sliderMinPosition), Number(this.sliderMaxPosition));
      let rightNum = Math.round((1 - pct) * 100);
      let leftNum = Math.round(pct * 100);
      if (Number.isNaN(leftNum) && Number.isNaN(rightNum)) {
        rightNum = 50;
        leftNum = 50;
      }
      if (this.sliderOrientation === Orientation.horizontal) {
        return direction2 === Direction.rtl ? `right: ${leftNum}%; left: ${rightNum}%;` : `left: ${leftNum}%; right: ${rightNum}%;`;
      } else {
        return `top: ${leftNum}%; bottom: ${rightNum}%;`;
      }
    };
  }
  positionChanged() {
    this.positionStyle = this.positionAsStyle();
  }
  /**
   * @internal
   */
  sliderOrientationChanged() {
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.getSliderConfiguration();
    this.positionStyle = this.positionAsStyle();
    this.notifier = Observable.getNotifier(this.parentNode);
    this.notifier.subscribe(this, "orientation");
    this.notifier.subscribe(this, "direction");
    this.notifier.subscribe(this, "max");
    this.notifier.subscribe(this, "min");
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.notifier.unsubscribe(this, "orientation");
    this.notifier.unsubscribe(this, "direction");
    this.notifier.unsubscribe(this, "max");
    this.notifier.unsubscribe(this, "min");
  }
  /**
   * @internal
   */
  handleChange(source, propertyName) {
    switch (propertyName) {
      case "direction":
        this.sliderDirection = source.direction;
        break;
      case "orientation":
        this.sliderOrientation = source.orientation;
        break;
      case "max":
        this.sliderMaxPosition = source.max;
        break;
      case "min":
        this.sliderMinPosition = source.min;
        break;
      default:
        break;
    }
    this.positionStyle = this.positionAsStyle();
  }
  isSliderConfig(node) {
    return node.max !== void 0 && node.min !== void 0;
  }
};
__decorate([
  observable
], SliderLabel.prototype, "positionStyle", void 0);
__decorate([
  attr
], SliderLabel.prototype, "position", void 0);
__decorate([
  attr({ attribute: "hide-mark", mode: "boolean" })
], SliderLabel.prototype, "hideMark", void 0);
__decorate([
  attr({ attribute: "disabled", mode: "boolean" })
], SliderLabel.prototype, "disabled", void 0);
__decorate([
  observable
], SliderLabel.prototype, "sliderOrientation", void 0);
__decorate([
  observable
], SliderLabel.prototype, "sliderMinPosition", void 0);
__decorate([
  observable
], SliderLabel.prototype, "sliderMaxPosition", void 0);
__decorate([
  observable
], SliderLabel.prototype, "sliderDirection", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/slider/slider.template.js
var sliderTemplate = (context, definition) => html2`
    <template
        role="slider"
        class="${(x) => x.readOnly ? "readonly" : ""}
        ${(x) => x.orientation || Orientation.horizontal}"
        tabindex="${(x) => x.disabled ? null : 0}"
        aria-valuetext="${(x) => x.valueTextFormatter(x.value)}"
        aria-valuenow="${(x) => x.value}"
        aria-valuemin="${(x) => x.min}"
        aria-valuemax="${(x) => x.max}"
        aria-disabled="${(x) => x.disabled ? true : void 0}"
        aria-readonly="${(x) => x.readOnly ? true : void 0}"
        aria-orientation="${(x) => x.orientation}"
        class="${(x) => x.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${ref("track")} part="track-container" class="track">
                <slot name="track"></slot>
                <div part="track-start" class="track-start" style="${(x) => x.position}">
                    <slot name="track-start"></slot>
                </div>
            </div>
            <slot></slot>
            <div
                ${ref("thumb")}
                part="thumb-container"
                class="thumb-container"
                style="${(x) => x.position}"
            >
                <slot name="thumb">${definition.thumb || ""}</slot>
            </div>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/slider/slider.form-associated.js
var _Slider = class extends FoundationElement {
};
var FormAssociatedSlider = class extends FormAssociated(_Slider) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/slider/slider.js
var SliderMode = {
  singleValue: "single-value"
};
var Slider = class extends FormAssociatedSlider {
  constructor() {
    super(...arguments);
    this.direction = Direction.ltr;
    this.isDragging = false;
    this.trackWidth = 0;
    this.trackMinWidth = 0;
    this.trackHeight = 0;
    this.trackLeft = 0;
    this.trackMinHeight = 0;
    this.valueTextFormatter = () => null;
    this.min = 0;
    this.max = 10;
    this.step = 1;
    this.orientation = Orientation.horizontal;
    this.mode = SliderMode.singleValue;
    this.keypressHandler = (e) => {
      if (this.readOnly) {
        return;
      }
      if (e.key === keyHome) {
        e.preventDefault();
        this.value = `${this.min}`;
      } else if (e.key === keyEnd) {
        e.preventDefault();
        this.value = `${this.max}`;
      } else if (!e.shiftKey) {
        switch (e.key) {
          case keyArrowRight:
          case keyArrowUp:
            e.preventDefault();
            this.increment();
            break;
          case keyArrowLeft:
          case keyArrowDown:
            e.preventDefault();
            this.decrement();
            break;
        }
      }
    };
    this.setupTrackConstraints = () => {
      const clientRect = this.track.getBoundingClientRect();
      this.trackWidth = this.track.clientWidth;
      this.trackMinWidth = this.track.clientLeft;
      this.trackHeight = clientRect.bottom;
      this.trackMinHeight = clientRect.top;
      this.trackLeft = this.getBoundingClientRect().left;
      if (this.trackWidth === 0) {
        this.trackWidth = 1;
      }
    };
    this.setupListeners = (remove = false) => {
      const eventAction = `${remove ? "remove" : "add"}EventListener`;
      this[eventAction]("keydown", this.keypressHandler);
      this[eventAction]("mousedown", this.handleMouseDown);
      this.thumb[eventAction]("mousedown", this.handleThumbMouseDown, {
        passive: true
      });
      this.thumb[eventAction]("touchstart", this.handleThumbMouseDown, {
        passive: true
      });
      if (remove) {
        this.handleMouseDown(null);
        this.handleThumbMouseDown(null);
      }
    };
    this.initialValue = "";
    this.handleThumbMouseDown = (event) => {
      if (event) {
        if (this.readOnly || this.disabled || event.defaultPrevented) {
          return;
        }
        event.target.focus();
      }
      const eventAction = `${event !== null ? "add" : "remove"}EventListener`;
      window[eventAction]("mouseup", this.handleWindowMouseUp);
      window[eventAction]("mousemove", this.handleMouseMove, { passive: true });
      window[eventAction]("touchmove", this.handleMouseMove, { passive: true });
      window[eventAction]("touchend", this.handleWindowMouseUp);
      this.isDragging = event !== null;
    };
    this.handleMouseMove = (e) => {
      if (this.readOnly || this.disabled || e.defaultPrevented) {
        return;
      }
      const sourceEvent = window.TouchEvent && e instanceof TouchEvent ? e.touches[0] : e;
      const eventValue = this.orientation === Orientation.horizontal ? sourceEvent.pageX - document.documentElement.scrollLeft - this.trackLeft : sourceEvent.pageY - document.documentElement.scrollTop;
      this.value = `${this.calculateNewValue(eventValue)}`;
    };
    this.calculateNewValue = (rawValue) => {
      const newPosition = convertPixelToPercent(rawValue, this.orientation === Orientation.horizontal ? this.trackMinWidth : this.trackMinHeight, this.orientation === Orientation.horizontal ? this.trackWidth : this.trackHeight, this.direction);
      const newValue = (this.max - this.min) * newPosition + this.min;
      return this.convertToConstrainedValue(newValue);
    };
    this.handleWindowMouseUp = (event) => {
      this.stopDragging();
    };
    this.stopDragging = () => {
      this.isDragging = false;
      this.handleMouseDown(null);
      this.handleThumbMouseDown(null);
    };
    this.handleMouseDown = (e) => {
      const eventAction = `${e !== null ? "add" : "remove"}EventListener`;
      if (e === null || !this.disabled && !this.readOnly) {
        window[eventAction]("mouseup", this.handleWindowMouseUp);
        window.document[eventAction]("mouseleave", this.handleWindowMouseUp);
        window[eventAction]("mousemove", this.handleMouseMove);
        if (e) {
          e.preventDefault();
          this.setupTrackConstraints();
          e.target.focus();
          const controlValue = this.orientation === Orientation.horizontal ? e.pageX - document.documentElement.scrollLeft - this.trackLeft : e.pageY - document.documentElement.scrollTop;
          this.value = `${this.calculateNewValue(controlValue)}`;
        }
      }
    };
    this.convertToConstrainedValue = (value) => {
      if (isNaN(value)) {
        value = this.min;
      }
      let constrainedValue = value - this.min;
      const roundedConstrainedValue = Math.round(constrainedValue / this.step);
      const remainderValue = constrainedValue - roundedConstrainedValue * (this.stepMultiplier * this.step) / this.stepMultiplier;
      constrainedValue = remainderValue >= Number(this.step) / 2 ? constrainedValue - remainderValue + Number(this.step) : constrainedValue - remainderValue;
      return constrainedValue + this.min;
    };
  }
  readOnlyChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.readOnly = this.readOnly;
    }
  }
  /**
   * The value property, typed as a number.
   *
   * @public
   */
  get valueAsNumber() {
    return parseFloat(super.value);
  }
  set valueAsNumber(next) {
    this.value = next.toString();
  }
  /**
   * @internal
   */
  valueChanged(previous, next) {
    super.valueChanged(previous, next);
    if (this.$fastController.isConnected) {
      this.setThumbPositionForOrientation(this.direction);
    }
    this.$emit("change");
  }
  minChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.min = `${this.min}`;
    }
    this.validate();
  }
  maxChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.max = `${this.max}`;
    }
    this.validate();
  }
  stepChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.step = `${this.step}`;
    }
    this.updateStepMultiplier();
    this.validate();
  }
  orientationChanged() {
    if (this.$fastController.isConnected) {
      this.setThumbPositionForOrientation(this.direction);
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.proxy.setAttribute("type", "range");
    this.direction = getDirection(this);
    this.updateStepMultiplier();
    this.setupTrackConstraints();
    this.setupListeners();
    this.setupDefaultValue();
    this.setThumbPositionForOrientation(this.direction);
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    this.setupListeners(true);
  }
  /**
   * Increment the value by the step
   *
   * @public
   */
  increment() {
    const newVal = this.direction !== Direction.rtl && this.orientation !== Orientation.vertical ? Number(this.value) + Number(this.step) : Number(this.value) - Number(this.step);
    const incrementedVal = this.convertToConstrainedValue(newVal);
    const incrementedValString = incrementedVal < Number(this.max) ? `${incrementedVal}` : `${this.max}`;
    this.value = incrementedValString;
  }
  /**
   * Decrement the value by the step
   *
   * @public
   */
  decrement() {
    const newVal = this.direction !== Direction.rtl && this.orientation !== Orientation.vertical ? Number(this.value) - Number(this.step) : Number(this.value) + Number(this.step);
    const decrementedVal = this.convertToConstrainedValue(newVal);
    const decrementedValString = decrementedVal > Number(this.min) ? `${decrementedVal}` : `${this.min}`;
    this.value = decrementedValString;
  }
  /**
   * Places the thumb based on the current value
   *
   * @public
   * @param direction - writing mode
   */
  setThumbPositionForOrientation(direction2) {
    const newPct = convertPixelToPercent(Number(this.value), Number(this.min), Number(this.max), direction2);
    const percentage = (1 - newPct) * 100;
    if (this.orientation === Orientation.horizontal) {
      this.position = this.isDragging ? `right: ${percentage}%; transition: none;` : `right: ${percentage}%; transition: all 0.2s ease;`;
    } else {
      this.position = this.isDragging ? `bottom: ${percentage}%; transition: none;` : `bottom: ${percentage}%; transition: all 0.2s ease;`;
    }
  }
  /**
   * Update the step multiplier used to ensure rounding errors from steps that
   * are not whole numbers
   */
  updateStepMultiplier() {
    const stepString = this.step + "";
    const decimalPlacesOfStep = !!(this.step % 1) ? stepString.length - stepString.indexOf(".") - 1 : 0;
    this.stepMultiplier = Math.pow(10, decimalPlacesOfStep);
  }
  get midpoint() {
    return `${this.convertToConstrainedValue((this.max + this.min) / 2)}`;
  }
  setupDefaultValue() {
    if (typeof this.value === "string") {
      if (this.value.length === 0) {
        this.initialValue = this.midpoint;
      } else {
        const value = parseFloat(this.value);
        if (!Number.isNaN(value) && (value < this.min || value > this.max)) {
          this.value = this.midpoint;
        }
      }
    }
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], Slider.prototype, "readOnly", void 0);
__decorate([
  observable
], Slider.prototype, "direction", void 0);
__decorate([
  observable
], Slider.prototype, "isDragging", void 0);
__decorate([
  observable
], Slider.prototype, "position", void 0);
__decorate([
  observable
], Slider.prototype, "trackWidth", void 0);
__decorate([
  observable
], Slider.prototype, "trackMinWidth", void 0);
__decorate([
  observable
], Slider.prototype, "trackHeight", void 0);
__decorate([
  observable
], Slider.prototype, "trackLeft", void 0);
__decorate([
  observable
], Slider.prototype, "trackMinHeight", void 0);
__decorate([
  observable
], Slider.prototype, "valueTextFormatter", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Slider.prototype, "min", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Slider.prototype, "max", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], Slider.prototype, "step", void 0);
__decorate([
  attr
], Slider.prototype, "orientation", void 0);
__decorate([
  attr
], Slider.prototype, "mode", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/switch/switch.template.js
var switchTemplate = (context, definition) => html2`
    <template
        role="switch"
        aria-checked="${(x) => x.checked}"
        aria-disabled="${(x) => x.disabled}"
        aria-readonly="${(x) => x.readOnly}"
        tabindex="${(x) => x.disabled ? null : 0}"
        @keypress="${(x, c) => x.keypressHandler(c.event)}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        class="${(x) => x.checked ? "checked" : ""}"
    >
        <label
            part="label"
            class="${(x) => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <div part="switch" class="switch">
            <slot name="switch">${definition.switch || ""}</slot>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/switch/switch.form-associated.js
var _Switch = class extends FoundationElement {
};
var FormAssociatedSwitch = class extends CheckableFormAssociated(_Switch) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("input");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/switch/switch.js
var Switch = class extends FormAssociatedSwitch {
  constructor() {
    super();
    this.initialValue = "on";
    this.keypressHandler = (e) => {
      if (this.readOnly) {
        return;
      }
      switch (e.key) {
        case keyEnter:
        case keySpace:
          this.checked = !this.checked;
          break;
      }
    };
    this.clickHandler = (e) => {
      if (!this.disabled && !this.readOnly) {
        this.checked = !this.checked;
      }
    };
    this.proxy.setAttribute("type", "checkbox");
  }
  readOnlyChanged() {
    if (this.proxy instanceof HTMLInputElement) {
      this.proxy.readOnly = this.readOnly;
    }
    this.readOnly ? this.classList.add("readonly") : this.classList.remove("readonly");
  }
  /**
   * @internal
   */
  checkedChanged(prev, next) {
    super.checkedChanged(prev, next);
    this.checked ? this.classList.add("checked") : this.classList.remove("checked");
  }
};
__decorate([
  attr({ attribute: "readonly", mode: "boolean" })
], Switch.prototype, "readOnly", void 0);
__decorate([
  observable
], Switch.prototype, "defaultSlottedNodes", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tab-panel/tab-panel.template.js
var tabPanelTemplate = (context, definition) => html2`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tab-panel/tab-panel.js
var TabPanel = class extends FoundationElement {
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tab/tab.template.js
var tabTemplate = (context, definition) => html2`
    <template slot="tab" role="tab" aria-disabled="${(x) => x.disabled}">
        <slot></slot>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tab/tab.js
var Tab = class extends FoundationElement {
};
__decorate([
  attr({ mode: "boolean" })
], Tab.prototype, "disabled", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tabs/tabs.template.js
var tabsTemplate = (context, definition) => html2`
    <template class="${(x) => x.orientation}">
        ${startSlotTemplate(context, definition)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${slotted("tabs")}></slot>

            ${when((x) => x.showActiveIndicator, html2`
                    <div
                        ${ref("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${endSlotTemplate(context, definition)}
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${slotted("tabpanels")}></slot>
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tabs/tabs.js
var TabsOrientation = {
  vertical: "vertical",
  horizontal: "horizontal"
};
var Tabs = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.orientation = TabsOrientation.horizontal;
    this.activeindicator = true;
    this.showActiveIndicator = true;
    this.prevActiveTabIndex = 0;
    this.activeTabIndex = 0;
    this.ticking = false;
    this.change = () => {
      this.$emit("change", this.activetab);
    };
    this.isDisabledElement = (el) => {
      return el.getAttribute("aria-disabled") === "true";
    };
    this.isHiddenElement = (el) => {
      return el.hasAttribute("hidden");
    };
    this.isFocusableElement = (el) => {
      return !this.isDisabledElement(el) && !this.isHiddenElement(el);
    };
    this.setTabs = () => {
      const gridHorizontalProperty = "gridColumn";
      const gridVerticalProperty = "gridRow";
      const gridProperty = this.isHorizontal() ? gridHorizontalProperty : gridVerticalProperty;
      this.activeTabIndex = this.getActiveIndex();
      this.showActiveIndicator = false;
      this.tabs.forEach((tab, index) => {
        if (tab.slot === "tab") {
          const isActiveTab = this.activeTabIndex === index && this.isFocusableElement(tab);
          if (this.activeindicator && this.isFocusableElement(tab)) {
            this.showActiveIndicator = true;
          }
          const tabId = this.tabIds[index];
          const tabpanelId = this.tabpanelIds[index];
          tab.setAttribute("id", tabId);
          tab.setAttribute("aria-selected", isActiveTab ? "true" : "false");
          tab.setAttribute("aria-controls", tabpanelId);
          tab.addEventListener("click", this.handleTabClick);
          tab.addEventListener("keydown", this.handleTabKeyDown);
          tab.setAttribute("tabindex", isActiveTab ? "0" : "-1");
          if (isActiveTab) {
            this.activetab = tab;
            this.activeid = tabId;
          }
        }
        tab.style[gridHorizontalProperty] = "";
        tab.style[gridVerticalProperty] = "";
        tab.style[gridProperty] = `${index + 1}`;
        !this.isHorizontal() ? tab.classList.add("vertical") : tab.classList.remove("vertical");
      });
    };
    this.setTabPanels = () => {
      this.tabpanels.forEach((tabpanel, index) => {
        const tabId = this.tabIds[index];
        const tabpanelId = this.tabpanelIds[index];
        tabpanel.setAttribute("id", tabpanelId);
        tabpanel.setAttribute("aria-labelledby", tabId);
        this.activeTabIndex !== index ? tabpanel.setAttribute("hidden", "") : tabpanel.removeAttribute("hidden");
      });
    };
    this.handleTabClick = (event) => {
      const selectedTab = event.currentTarget;
      if (selectedTab.nodeType === 1 && this.isFocusableElement(selectedTab)) {
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = this.tabs.indexOf(selectedTab);
        this.setComponent();
      }
    };
    this.handleTabKeyDown = (event) => {
      if (this.isHorizontal()) {
        switch (event.key) {
          case keyArrowLeft:
            event.preventDefault();
            this.adjustBackward(event);
            break;
          case keyArrowRight:
            event.preventDefault();
            this.adjustForward(event);
            break;
        }
      } else {
        switch (event.key) {
          case keyArrowUp:
            event.preventDefault();
            this.adjustBackward(event);
            break;
          case keyArrowDown:
            event.preventDefault();
            this.adjustForward(event);
            break;
        }
      }
      switch (event.key) {
        case keyHome:
          event.preventDefault();
          this.adjust(-this.activeTabIndex);
          break;
        case keyEnd:
          event.preventDefault();
          this.adjust(this.tabs.length - this.activeTabIndex - 1);
          break;
      }
    };
    this.adjustForward = (e) => {
      const group = this.tabs;
      let index = 0;
      index = this.activetab ? group.indexOf(this.activetab) + 1 : 1;
      if (index === group.length) {
        index = 0;
      }
      while (index < group.length && group.length > 1) {
        if (this.isFocusableElement(group[index])) {
          this.moveToTabByIndex(group, index);
          break;
        } else if (this.activetab && index === group.indexOf(this.activetab)) {
          break;
        } else if (index + 1 >= group.length) {
          index = 0;
        } else {
          index += 1;
        }
      }
    };
    this.adjustBackward = (e) => {
      const group = this.tabs;
      let index = 0;
      index = this.activetab ? group.indexOf(this.activetab) - 1 : 0;
      index = index < 0 ? group.length - 1 : index;
      while (index >= 0 && group.length > 1) {
        if (this.isFocusableElement(group[index])) {
          this.moveToTabByIndex(group, index);
          break;
        } else if (index - 1 < 0) {
          index = group.length - 1;
        } else {
          index -= 1;
        }
      }
    };
    this.moveToTabByIndex = (group, index) => {
      const tab = group[index];
      this.activetab = tab;
      this.prevActiveTabIndex = this.activeTabIndex;
      this.activeTabIndex = index;
      tab.focus();
      this.setComponent();
    };
  }
  /**
   * @internal
   */
  orientationChanged() {
    if (this.$fastController.isConnected) {
      this.setTabs();
      this.setTabPanels();
      this.handleActiveIndicatorPosition();
    }
  }
  /**
   * @internal
   */
  activeidChanged(oldValue, newValue) {
    if (this.$fastController.isConnected && this.tabs.length <= this.tabpanels.length) {
      this.prevActiveTabIndex = this.tabs.findIndex((item) => item.id === oldValue);
      this.setTabs();
      this.setTabPanels();
      this.handleActiveIndicatorPosition();
    }
  }
  /**
   * @internal
   */
  tabsChanged() {
    if (this.$fastController.isConnected && this.tabs.length <= this.tabpanels.length) {
      this.tabIds = this.getTabIds();
      this.tabpanelIds = this.getTabPanelIds();
      this.setTabs();
      this.setTabPanels();
      this.handleActiveIndicatorPosition();
    }
  }
  /**
   * @internal
   */
  tabpanelsChanged() {
    if (this.$fastController.isConnected && this.tabpanels.length <= this.tabs.length) {
      this.tabIds = this.getTabIds();
      this.tabpanelIds = this.getTabPanelIds();
      this.setTabs();
      this.setTabPanels();
      this.handleActiveIndicatorPosition();
    }
  }
  getActiveIndex() {
    const id = this.activeid;
    if (id !== void 0) {
      return this.tabIds.indexOf(this.activeid) === -1 ? 0 : this.tabIds.indexOf(this.activeid);
    } else {
      return 0;
    }
  }
  getTabIds() {
    return this.tabs.map((tab) => {
      var _a;
      return (_a = tab.getAttribute("id")) !== null && _a !== void 0 ? _a : `tab-${uniqueId()}`;
    });
  }
  getTabPanelIds() {
    return this.tabpanels.map((tabPanel) => {
      var _a;
      return (_a = tabPanel.getAttribute("id")) !== null && _a !== void 0 ? _a : `panel-${uniqueId()}`;
    });
  }
  setComponent() {
    if (this.activeTabIndex !== this.prevActiveTabIndex) {
      this.activeid = this.tabIds[this.activeTabIndex];
      this.focusTab();
      this.change();
    }
  }
  isHorizontal() {
    return this.orientation === TabsOrientation.horizontal;
  }
  handleActiveIndicatorPosition() {
    if (this.showActiveIndicator && this.activeindicator && this.activeTabIndex !== this.prevActiveTabIndex) {
      if (this.ticking) {
        this.ticking = false;
      } else {
        this.ticking = true;
        this.animateActiveIndicator();
      }
    }
  }
  animateActiveIndicator() {
    this.ticking = true;
    const gridProperty = this.isHorizontal() ? "gridColumn" : "gridRow";
    const translateProperty = this.isHorizontal() ? "translateX" : "translateY";
    const offsetProperty = this.isHorizontal() ? "offsetLeft" : "offsetTop";
    const prev = this.activeIndicatorRef[offsetProperty];
    this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
    const next = this.activeIndicatorRef[offsetProperty];
    this.activeIndicatorRef.style[gridProperty] = `${this.prevActiveTabIndex + 1}`;
    const dif = next - prev;
    this.activeIndicatorRef.style.transform = `${translateProperty}(${dif}px)`;
    this.activeIndicatorRef.classList.add("activeIndicatorTransition");
    this.activeIndicatorRef.addEventListener("transitionend", () => {
      this.ticking = false;
      this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
      this.activeIndicatorRef.style.transform = `${translateProperty}(0px)`;
      this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
    });
  }
  /**
   * The adjust method for FASTTabs
   * @public
   * @remarks
   * This method allows the active index to be adjusted by numerical increments
   */
  adjust(adjustment) {
    const focusableTabs = this.tabs.filter((t) => this.isFocusableElement(t));
    const currentActiveTabIndex = focusableTabs.indexOf(this.activetab);
    const nextTabIndex = limit(0, focusableTabs.length - 1, currentActiveTabIndex + adjustment);
    const nextIndex = this.tabs.indexOf(focusableTabs[nextTabIndex]);
    if (nextIndex > -1) {
      this.moveToTabByIndex(this.tabs, nextIndex);
    }
  }
  focusTab() {
    this.tabs[this.activeTabIndex].focus();
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.tabIds = this.getTabIds();
    this.tabpanelIds = this.getTabPanelIds();
    this.activeTabIndex = this.getActiveIndex();
  }
};
__decorate([
  attr
], Tabs.prototype, "orientation", void 0);
__decorate([
  attr
], Tabs.prototype, "activeid", void 0);
__decorate([
  observable
], Tabs.prototype, "tabs", void 0);
__decorate([
  observable
], Tabs.prototype, "tabpanels", void 0);
__decorate([
  attr({ mode: "boolean" })
], Tabs.prototype, "activeindicator", void 0);
__decorate([
  observable
], Tabs.prototype, "activeIndicatorRef", void 0);
__decorate([
  observable
], Tabs.prototype, "showActiveIndicator", void 0);
applyMixins(Tabs, StartEnd);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-area/text-area.form-associated.js
var _TextArea = class extends FoundationElement {
};
var FormAssociatedTextArea = class extends FormAssociated(_TextArea) {
  constructor() {
    super(...arguments);
    this.proxy = document.createElement("textarea");
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-area/text-area.options.js
var TextAreaResize = {
  /**
   * No resize.
   */
  none: "none",
  /**
   * Resize vertically and horizontally.
   */
  both: "both",
  /**
   * Resize horizontally.
   */
  horizontal: "horizontal",
  /**
   * Resize vertically.
   */
  vertical: "vertical"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-area/text-area.js
var TextArea = class extends FormAssociatedTextArea {
  constructor() {
    super(...arguments);
    this.resize = TextAreaResize.none;
    this.cols = 20;
    this.handleTextInput = () => {
      this.value = this.control.value;
    };
  }
  readOnlyChanged() {
    if (this.proxy instanceof HTMLTextAreaElement) {
      this.proxy.readOnly = this.readOnly;
    }
  }
  autofocusChanged() {
    if (this.proxy instanceof HTMLTextAreaElement) {
      this.proxy.autofocus = this.autofocus;
    }
  }
  listChanged() {
    if (this.proxy instanceof HTMLTextAreaElement) {
      this.proxy.setAttribute("list", this.list);
    }
  }
  maxlengthChanged() {
    if (this.proxy instanceof HTMLTextAreaElement) {
      this.proxy.maxLength = this.maxlength;
    }
  }
  minlengthChanged() {
    if (this.proxy instanceof HTMLTextAreaElement) {
      this.proxy.minLength = this.minlength;
    }
  }
  spellcheckChanged() {
    if (this.proxy instanceof HTMLTextAreaElement) {
      this.proxy.spellcheck = this.spellcheck;
    }
  }
  /**
   * Selects all the text in the text area
   *
   * @public
   */
  select() {
    this.control.select();
    this.$emit("select");
  }
  /**
   * Change event handler for inner control.
   * @remarks
   * "Change" events are not `composable` so they will not
   * permeate the shadow DOM boundary. This fn effectively proxies
   * the change event, emitting a `change` event whenever the internal
   * control emits a `change` event
   * @internal
   */
  handleChange() {
    this.$emit("change");
  }
  /** {@inheritDoc (FormAssociated:interface).validate} */
  validate() {
    super.validate(this.control);
  }
};
__decorate([
  attr({ mode: "boolean" })
], TextArea.prototype, "readOnly", void 0);
__decorate([
  attr
], TextArea.prototype, "resize", void 0);
__decorate([
  attr({ mode: "boolean" })
], TextArea.prototype, "autofocus", void 0);
__decorate([
  attr({ attribute: "form" })
], TextArea.prototype, "formId", void 0);
__decorate([
  attr
], TextArea.prototype, "list", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], TextArea.prototype, "maxlength", void 0);
__decorate([
  attr({ converter: nullableNumberConverter })
], TextArea.prototype, "minlength", void 0);
__decorate([
  attr
], TextArea.prototype, "name", void 0);
__decorate([
  attr
], TextArea.prototype, "placeholder", void 0);
__decorate([
  attr({ converter: nullableNumberConverter, mode: "fromView" })
], TextArea.prototype, "cols", void 0);
__decorate([
  attr({ converter: nullableNumberConverter, mode: "fromView" })
], TextArea.prototype, "rows", void 0);
__decorate([
  attr({ mode: "boolean" })
], TextArea.prototype, "spellcheck", void 0);
__decorate([
  observable
], TextArea.prototype, "defaultSlottedNodes", void 0);
applyMixins(TextArea, DelegatesARIATextbox);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-area/text-area.template.js
var textAreaTemplate = (context, definition) => html2`
    <template
        class="
            ${(x) => x.readOnly ? "readonly" : ""}
            ${(x) => x.resize !== TextAreaResize.none ? `resize-${x.resize}` : ""}"
    >
        <label
            part="label"
            for="control"
            class="${(x) => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${(x) => x.autofocus}"
            cols="${(x) => x.cols}"
            ?disabled="${(x) => x.disabled}"
            form="${(x) => x.form}"
            list="${(x) => x.list}"
            maxlength="${(x) => x.maxlength}"
            minlength="${(x) => x.minlength}"
            name="${(x) => x.name}"
            placeholder="${(x) => x.placeholder}"
            ?readonly="${(x) => x.readOnly}"
            ?required="${(x) => x.required}"
            rows="${(x) => x.rows}"
            ?spellcheck="${(x) => x.spellcheck}"
            :value="${(x) => x.value}"
            aria-atomic="${(x) => x.ariaAtomic}"
            aria-busy="${(x) => x.ariaBusy}"
            aria-controls="${(x) => x.ariaControls}"
            aria-current="${(x) => x.ariaCurrent}"
            aria-describedby="${(x) => x.ariaDescribedby}"
            aria-details="${(x) => x.ariaDetails}"
            aria-disabled="${(x) => x.ariaDisabled}"
            aria-errormessage="${(x) => x.ariaErrormessage}"
            aria-flowto="${(x) => x.ariaFlowto}"
            aria-haspopup="${(x) => x.ariaHaspopup}"
            aria-hidden="${(x) => x.ariaHidden}"
            aria-invalid="${(x) => x.ariaInvalid}"
            aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
            aria-label="${(x) => x.ariaLabel}"
            aria-labelledby="${(x) => x.ariaLabelledby}"
            aria-live="${(x) => x.ariaLive}"
            aria-owns="${(x) => x.ariaOwns}"
            aria-relevant="${(x) => x.ariaRelevant}"
            aria-roledescription="${(x) => x.ariaRoledescription}"
            @input="${(x, c) => x.handleTextInput()}"
            @change="${(x) => x.handleChange()}"
            ${ref("control")}
        ></textarea>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/text-field/text-field.template.js
var textFieldTemplate = (context, definition) => html2`
    <template
        class="
            ${(x) => x.readOnly ? "readonly" : ""}
        "
    >
        <label
            part="label"
            for="control"
            class="${(x) => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot
                ${slotted({ property: "defaultSlottedNodes", filter: whitespaceFilter })}
            ></slot>
        </label>
        <div class="root" part="root">
            ${startSlotTemplate(context, definition)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${(x) => x.handleTextInput()}"
                @change="${(x) => x.handleChange()}"
                ?autofocus="${(x) => x.autofocus}"
                ?disabled="${(x) => x.disabled}"
                list="${(x) => x.list}"
                maxlength="${(x) => x.maxlength}"
                minlength="${(x) => x.minlength}"
                pattern="${(x) => x.pattern}"
                placeholder="${(x) => x.placeholder}"
                ?readonly="${(x) => x.readOnly}"
                ?required="${(x) => x.required}"
                size="${(x) => x.size}"
                ?spellcheck="${(x) => x.spellcheck}"
                :value="${(x) => x.value}"
                type="${(x) => x.type}"
                aria-atomic="${(x) => x.ariaAtomic}"
                aria-busy="${(x) => x.ariaBusy}"
                aria-controls="${(x) => x.ariaControls}"
                aria-current="${(x) => x.ariaCurrent}"
                aria-describedby="${(x) => x.ariaDescribedby}"
                aria-details="${(x) => x.ariaDetails}"
                aria-disabled="${(x) => x.ariaDisabled}"
                aria-errormessage="${(x) => x.ariaErrormessage}"
                aria-flowto="${(x) => x.ariaFlowto}"
                aria-haspopup="${(x) => x.ariaHaspopup}"
                aria-hidden="${(x) => x.ariaHidden}"
                aria-invalid="${(x) => x.ariaInvalid}"
                aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
                aria-label="${(x) => x.ariaLabel}"
                aria-labelledby="${(x) => x.ariaLabelledby}"
                aria-live="${(x) => x.ariaLive}"
                aria-owns="${(x) => x.ariaOwns}"
                aria-relevant="${(x) => x.ariaRelevant}"
                aria-roledescription="${(x) => x.ariaRoledescription}"
                ${ref("control")}
            />
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/toolbar/toolbar.template.js
var toolbarTemplate = (context, definition) => html2`
    <template
        aria-label="${(x) => x.ariaLabel}"
        aria-labelledby="${(x) => x.ariaLabelledby}"
        aria-orientation="${(x) => x.orientation}"
        orientation="${(x) => x.orientation}"
        role="toolbar"
        @mousedown="${(x, c) => x.mouseDownHandler(c.event)}"
        @focusin="${(x, c) => x.focusinHandler(c.event)}"
        @keydown="${(x, c) => x.keydownHandler(c.event)}"
        ${children({
  property: "childItems",
  attributeFilter: ["disabled", "hidden"],
  filter: elements(),
  subtree: true
})}
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            ${startSlotTemplate(context, definition)}
            <slot
                ${slotted({
  filter: elements(),
  property: "slottedItems"
})}
            ></slot>
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/root-active-element.js
function getRootActiveElement(element) {
  const rootNode = element.getRootNode();
  if (rootNode instanceof ShadowRoot) {
    return rootNode.activeElement;
  }
  return document.activeElement;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/toolbar/toolbar.js
var ToolbarArrowKeyMap = Object.freeze({
  [ArrowKeys.ArrowUp]: {
    [Orientation.vertical]: -1
  },
  [ArrowKeys.ArrowDown]: {
    [Orientation.vertical]: 1
  },
  [ArrowKeys.ArrowLeft]: {
    [Orientation.horizontal]: {
      [Direction.ltr]: -1,
      [Direction.rtl]: 1
    }
  },
  [ArrowKeys.ArrowRight]: {
    [Orientation.horizontal]: {
      [Direction.ltr]: 1,
      [Direction.rtl]: -1
    }
  }
});
var Toolbar = class _Toolbar extends FoundationElement {
  constructor() {
    super(...arguments);
    this._activeIndex = 0;
    this.direction = Direction.ltr;
    this.orientation = Orientation.horizontal;
  }
  /**
   * The index of the currently focused element, clamped between 0 and the last element.
   *
   * @internal
   */
  get activeIndex() {
    Observable.track(this, "activeIndex");
    return this._activeIndex;
  }
  set activeIndex(value) {
    if (this.$fastController.isConnected) {
      this._activeIndex = limit(0, this.focusableElements.length - 1, value);
      Observable.notify(this, "activeIndex");
    }
  }
  slottedItemsChanged() {
    if (this.$fastController.isConnected) {
      this.reduceFocusableElements();
    }
  }
  /**
   * Set the activeIndex when a focusable element in the toolbar is clicked.
   *
   * @internal
   */
  mouseDownHandler(e) {
    var _a;
    const activeIndex = (_a = this.focusableElements) === null || _a === void 0 ? void 0 : _a.findIndex((x) => x.contains(e.target));
    if (activeIndex > -1 && this.activeIndex !== activeIndex) {
      this.setFocusedElement(activeIndex);
    }
    return true;
  }
  childItemsChanged(prev, next) {
    if (this.$fastController.isConnected) {
      this.reduceFocusableElements();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    this.direction = getDirection(this);
  }
  /**
   * When the toolbar receives focus, set the currently active element as focused.
   *
   * @internal
   */
  focusinHandler(e) {
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || this.contains(relatedTarget)) {
      return;
    }
    this.setFocusedElement();
  }
  /**
   * Determines a value that can be used to iterate a list with the arrow keys.
   *
   * @param this - An element with an orientation and direction
   * @param key - The event key value
   * @internal
   */
  getDirectionalIncrementer(key) {
    var _a, _b, _c, _d, _e;
    return (_e = (_c = (_b = (_a = ToolbarArrowKeyMap[key]) === null || _a === void 0 ? void 0 : _a[this.orientation]) === null || _b === void 0 ? void 0 : _b[this.direction]) !== null && _c !== void 0 ? _c : (_d = ToolbarArrowKeyMap[key]) === null || _d === void 0 ? void 0 : _d[this.orientation]) !== null && _e !== void 0 ? _e : 0;
  }
  /**
   * Handle keyboard events for the toolbar.
   *
   * @internal
   */
  keydownHandler(e) {
    const key = e.key;
    if (!(key in ArrowKeys) || e.defaultPrevented || e.shiftKey) {
      return true;
    }
    const incrementer = this.getDirectionalIncrementer(key);
    if (!incrementer) {
      return !e.target.closest("[role=radiogroup]");
    }
    const nextIndex = this.activeIndex + incrementer;
    if (this.focusableElements[nextIndex]) {
      e.preventDefault();
    }
    this.setFocusedElement(nextIndex);
    return true;
  }
  /**
   * get all the slotted elements
   * @internal
   */
  get allSlottedItems() {
    return [
      ...this.start.assignedElements(),
      ...this.slottedItems,
      ...this.end.assignedElements()
    ];
  }
  /**
   * Prepare the slotted elements which can be focusable.
   *
   * @internal
   */
  reduceFocusableElements() {
    var _a;
    const previousFocusedElement = (_a = this.focusableElements) === null || _a === void 0 ? void 0 : _a[this.activeIndex];
    this.focusableElements = this.allSlottedItems.reduce(_Toolbar.reduceFocusableItems, []);
    const adjustedActiveIndex = this.focusableElements.indexOf(previousFocusedElement);
    this.activeIndex = Math.max(0, adjustedActiveIndex);
    this.setFocusableElements();
  }
  /**
   * Set the activeIndex and focus the corresponding control.
   *
   * @param activeIndex - The new index to set
   * @internal
   */
  setFocusedElement(activeIndex = this.activeIndex) {
    this.activeIndex = activeIndex;
    this.setFocusableElements();
    if (this.focusableElements[this.activeIndex] && // Don't focus the toolbar element if some event handlers moved
    // the focus on another element in the page.
    this.contains(getRootActiveElement(this))) {
      this.focusableElements[this.activeIndex].focus();
    }
  }
  /**
   * Reduce a collection to only its focusable elements.
   *
   * @param elements - Collection of elements to reduce
   * @param element - The current element
   *
   * @internal
   */
  static reduceFocusableItems(elements2, element) {
    var _a, _b, _c, _d;
    const isRoleRadio = element.getAttribute("role") === "radio";
    const isFocusableFastElement = (_b = (_a = element.$fastController) === null || _a === void 0 ? void 0 : _a.definition.shadowOptions) === null || _b === void 0 ? void 0 : _b.delegatesFocus;
    const hasFocusableShadow = Array.from((_d = (_c = element.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelectorAll("*")) !== null && _d !== void 0 ? _d : []).some((x) => isFocusable(x));
    if (!element.hasAttribute("disabled") && !element.hasAttribute("hidden") && (isFocusable(element) || isRoleRadio || isFocusableFastElement || hasFocusableShadow)) {
      elements2.push(element);
      return elements2;
    }
    if (element.childElementCount) {
      return elements2.concat(Array.from(element.children).reduce(_Toolbar.reduceFocusableItems, []));
    }
    return elements2;
  }
  /**
   * @internal
   */
  setFocusableElements() {
    if (this.$fastController.isConnected && this.focusableElements.length > 0) {
      this.focusableElements.forEach((element, index) => {
        element.tabIndex = this.activeIndex === index ? 0 : -1;
      });
    }
  }
};
__decorate([
  observable
], Toolbar.prototype, "direction", void 0);
__decorate([
  attr
], Toolbar.prototype, "orientation", void 0);
__decorate([
  observable
], Toolbar.prototype, "slottedItems", void 0);
__decorate([
  observable
], Toolbar.prototype, "slottedLabel", void 0);
__decorate([
  observable
], Toolbar.prototype, "childItems", void 0);
var DelegatesARIAToolbar = class {
};
__decorate([
  attr({ attribute: "aria-labelledby" })
], DelegatesARIAToolbar.prototype, "ariaLabelledby", void 0);
__decorate([
  attr({ attribute: "aria-label" })
], DelegatesARIAToolbar.prototype, "ariaLabel", void 0);
applyMixins(DelegatesARIAToolbar, ARIAGlobalStatesAndProperties);
applyMixins(Toolbar, StartEnd, DelegatesARIAToolbar);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tooltip/tooltip.template.js
var tooltipTemplate = (context, definition) => {
  return html2`
        ${when((x) => x.tooltipVisible, html2`
            <${context.tagFor(AnchoredRegion)}
                fixed-placement="true"
                auto-update-mode="${(x) => x.autoUpdateMode}"
                vertical-positioning-mode="${(x) => x.verticalPositioningMode}"
                vertical-default-position="${(x) => x.verticalDefaultPosition}"
                vertical-inset="${(x) => x.verticalInset}"
                vertical-scaling="${(x) => x.verticalScaling}"
                horizontal-positioning-mode="${(x) => x.horizontalPositioningMode}"
                horizontal-default-position="${(x) => x.horizontalDefaultPosition}"
                horizontal-scaling="${(x) => x.horizontalScaling}"
                horizontal-inset="${(x) => x.horizontalInset}"
                vertical-viewport-lock="${(x) => x.horizontalViewportLock}"
                horizontal-viewport-lock="${(x) => x.verticalViewportLock}"
                dir="${(x) => x.currentDirection}"
                ${ref("region")}
            >
                <div class="tooltip" part="tooltip" role="tooltip">
                    <slot></slot>
                </div>
            </${context.tagFor(AnchoredRegion)}>
        `)}
    `;
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tooltip/tooltip.options.js
var TooltipPosition = {
  /**
   * The tooltip is positioned above the element
   */
  top: "top",
  /**
   * The tooltip is positioned to the right of the element
   */
  right: "right",
  /**
   * The tooltip is positioned below the element
   */
  bottom: "bottom",
  /**
   * The tooltip is positioned to the left of the element
   */
  left: "left",
  /**
   * The tooltip is positioned before the element
   */
  start: "start",
  /**
   * The tooltip is positioned after the element
   */
  end: "end",
  /**
   * The tooltip is positioned above the element and to the left
   */
  topLeft: "top-left",
  /**
   * The tooltip is positioned above the element and to the right
   */
  topRight: "top-right",
  /**
   * The tooltip is positioned below the element and to the left
   */
  bottomLeft: "bottom-left",
  /**
   * The tooltip is positioned below the element and to the right
   */
  bottomRight: "bottom-right",
  /**
   * The tooltip is positioned above the element and to the left
   */
  topStart: "top-start",
  /**
   * The tooltip is positioned above the element and to the right
   */
  topEnd: "top-end",
  /**
   * The tooltip is positioned below the element and to the left
   */
  bottomStart: "bottom-start",
  /**
   * The tooltip is positioned below the element and to the right
   */
  bottomEnd: "bottom-end"
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tooltip/tooltip.js
var Tooltip = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.anchor = "";
    this.delay = 300;
    this.autoUpdateMode = "anchor";
    this.anchorElement = null;
    this.viewportElement = null;
    this.verticalPositioningMode = "dynamic";
    this.horizontalPositioningMode = "dynamic";
    this.horizontalInset = "false";
    this.verticalInset = "false";
    this.horizontalScaling = "content";
    this.verticalScaling = "content";
    this.verticalDefaultPosition = void 0;
    this.horizontalDefaultPosition = void 0;
    this.tooltipVisible = false;
    this.currentDirection = Direction.ltr;
    this.showDelayTimer = null;
    this.hideDelayTimer = null;
    this.isAnchorHoveredFocused = false;
    this.isRegionHovered = false;
    this.handlePositionChange = (ev) => {
      this.classList.toggle("top", this.region.verticalPosition === "start");
      this.classList.toggle("bottom", this.region.verticalPosition === "end");
      this.classList.toggle("inset-top", this.region.verticalPosition === "insetStart");
      this.classList.toggle("inset-bottom", this.region.verticalPosition === "insetEnd");
      this.classList.toggle("center-vertical", this.region.verticalPosition === "center");
      this.classList.toggle("left", this.region.horizontalPosition === "start");
      this.classList.toggle("right", this.region.horizontalPosition === "end");
      this.classList.toggle("inset-left", this.region.horizontalPosition === "insetStart");
      this.classList.toggle("inset-right", this.region.horizontalPosition === "insetEnd");
      this.classList.toggle("center-horizontal", this.region.horizontalPosition === "center");
    };
    this.handleRegionMouseOver = (ev) => {
      this.isRegionHovered = true;
    };
    this.handleRegionMouseOut = (ev) => {
      this.isRegionHovered = false;
      this.startHideDelayTimer();
    };
    this.handleAnchorMouseOver = (ev) => {
      if (this.tooltipVisible) {
        this.isAnchorHoveredFocused = true;
        return;
      }
      this.startShowDelayTimer();
    };
    this.handleAnchorMouseOut = (ev) => {
      this.isAnchorHoveredFocused = false;
      this.clearShowDelayTimer();
      this.startHideDelayTimer();
    };
    this.handleAnchorFocusIn = (ev) => {
      this.startShowDelayTimer();
    };
    this.handleAnchorFocusOut = (ev) => {
      this.isAnchorHoveredFocused = false;
      this.clearShowDelayTimer();
      this.startHideDelayTimer();
    };
    this.startHideDelayTimer = () => {
      this.clearHideDelayTimer();
      if (!this.tooltipVisible) {
        return;
      }
      this.hideDelayTimer = window.setTimeout(() => {
        this.updateTooltipVisibility();
      }, 60);
    };
    this.clearHideDelayTimer = () => {
      if (this.hideDelayTimer !== null) {
        clearTimeout(this.hideDelayTimer);
        this.hideDelayTimer = null;
      }
    };
    this.startShowDelayTimer = () => {
      if (this.isAnchorHoveredFocused) {
        return;
      }
      if (this.delay > 1) {
        if (this.showDelayTimer === null)
          this.showDelayTimer = window.setTimeout(() => {
            this.startHover();
          }, this.delay);
        return;
      }
      this.startHover();
    };
    this.startHover = () => {
      this.isAnchorHoveredFocused = true;
      this.updateTooltipVisibility();
    };
    this.clearShowDelayTimer = () => {
      if (this.showDelayTimer !== null) {
        clearTimeout(this.showDelayTimer);
        this.showDelayTimer = null;
      }
    };
    this.getAnchor = () => {
      const rootNode = this.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        return rootNode.getElementById(this.anchor);
      }
      return document.getElementById(this.anchor);
    };
    this.handleDocumentKeydown = (e) => {
      if (!e.defaultPrevented && this.tooltipVisible) {
        switch (e.key) {
          case keyEscape:
            this.isAnchorHoveredFocused = false;
            this.updateTooltipVisibility();
            this.$emit("dismiss");
            break;
        }
      }
    };
    this.updateTooltipVisibility = () => {
      if (this.visible === false) {
        this.hideTooltip();
      } else if (this.visible === true) {
        this.showTooltip();
        return;
      } else {
        if (this.isAnchorHoveredFocused || this.isRegionHovered) {
          this.showTooltip();
          return;
        }
        this.hideTooltip();
      }
    };
    this.showTooltip = () => {
      if (this.tooltipVisible) {
        return;
      }
      this.currentDirection = getDirection(this);
      this.tooltipVisible = true;
      document.addEventListener("keydown", this.handleDocumentKeydown);
      DOM.queueUpdate(this.setRegionProps);
    };
    this.hideTooltip = () => {
      if (!this.tooltipVisible) {
        return;
      }
      this.clearHideDelayTimer();
      if (this.region !== null && this.region !== void 0) {
        this.region.removeEventListener("positionchange", this.handlePositionChange);
        this.region.viewportElement = null;
        this.region.anchorElement = null;
        this.region.removeEventListener("mouseover", this.handleRegionMouseOver);
        this.region.removeEventListener("mouseout", this.handleRegionMouseOut);
      }
      document.removeEventListener("keydown", this.handleDocumentKeydown);
      this.tooltipVisible = false;
    };
    this.setRegionProps = () => {
      if (!this.tooltipVisible) {
        return;
      }
      this.region.viewportElement = this.viewportElement;
      this.region.anchorElement = this.anchorElement;
      this.region.addEventListener("positionchange", this.handlePositionChange);
      this.region.addEventListener("mouseover", this.handleRegionMouseOver, {
        passive: true
      });
      this.region.addEventListener("mouseout", this.handleRegionMouseOut, {
        passive: true
      });
    };
  }
  visibleChanged() {
    if (this.$fastController.isConnected) {
      this.updateTooltipVisibility();
      this.updateLayout();
    }
  }
  anchorChanged() {
    if (this.$fastController.isConnected) {
      this.anchorElement = this.getAnchor();
    }
  }
  positionChanged() {
    if (this.$fastController.isConnected) {
      this.updateLayout();
    }
  }
  anchorElementChanged(oldValue) {
    if (this.$fastController.isConnected) {
      if (oldValue !== null && oldValue !== void 0) {
        oldValue.removeEventListener("mouseover", this.handleAnchorMouseOver);
        oldValue.removeEventListener("mouseout", this.handleAnchorMouseOut);
        oldValue.removeEventListener("focusin", this.handleAnchorFocusIn);
        oldValue.removeEventListener("focusout", this.handleAnchorFocusOut);
      }
      if (this.anchorElement !== null && this.anchorElement !== void 0) {
        this.anchorElement.addEventListener("mouseover", this.handleAnchorMouseOver, { passive: true });
        this.anchorElement.addEventListener("mouseout", this.handleAnchorMouseOut, { passive: true });
        this.anchorElement.addEventListener("focusin", this.handleAnchorFocusIn, {
          passive: true
        });
        this.anchorElement.addEventListener("focusout", this.handleAnchorFocusOut, { passive: true });
        const anchorId = this.anchorElement.id;
        if (this.anchorElement.parentElement !== null) {
          this.anchorElement.parentElement.querySelectorAll(":hover").forEach((element) => {
            if (element.id === anchorId) {
              this.startShowDelayTimer();
            }
          });
        }
      }
      if (this.region !== null && this.region !== void 0 && this.tooltipVisible) {
        this.region.anchorElement = this.anchorElement;
      }
      this.updateLayout();
    }
  }
  viewportElementChanged() {
    if (this.region !== null && this.region !== void 0) {
      this.region.viewportElement = this.viewportElement;
    }
    this.updateLayout();
  }
  connectedCallback() {
    super.connectedCallback();
    this.anchorElement = this.getAnchor();
    this.updateTooltipVisibility();
  }
  disconnectedCallback() {
    this.hideTooltip();
    this.clearShowDelayTimer();
    this.clearHideDelayTimer();
    super.disconnectedCallback();
  }
  /**
   * updated the properties being passed to the anchored region
   */
  updateLayout() {
    this.verticalPositioningMode = "locktodefault";
    this.horizontalPositioningMode = "locktodefault";
    switch (this.position) {
      case TooltipPosition.top:
      case TooltipPosition.bottom:
        this.verticalDefaultPosition = this.position;
        this.horizontalDefaultPosition = "center";
        break;
      case TooltipPosition.right:
      case TooltipPosition.left:
      case TooltipPosition.start:
      case TooltipPosition.end:
        this.verticalDefaultPosition = "center";
        this.horizontalDefaultPosition = this.position;
        break;
      case TooltipPosition.topLeft:
        this.verticalDefaultPosition = "top";
        this.horizontalDefaultPosition = "left";
        break;
      case TooltipPosition.topRight:
        this.verticalDefaultPosition = "top";
        this.horizontalDefaultPosition = "right";
        break;
      case TooltipPosition.bottomLeft:
        this.verticalDefaultPosition = "bottom";
        this.horizontalDefaultPosition = "left";
        break;
      case TooltipPosition.bottomRight:
        this.verticalDefaultPosition = "bottom";
        this.horizontalDefaultPosition = "right";
        break;
      case TooltipPosition.topStart:
        this.verticalDefaultPosition = "top";
        this.horizontalDefaultPosition = "start";
        break;
      case TooltipPosition.topEnd:
        this.verticalDefaultPosition = "top";
        this.horizontalDefaultPosition = "end";
        break;
      case TooltipPosition.bottomStart:
        this.verticalDefaultPosition = "bottom";
        this.horizontalDefaultPosition = "start";
        break;
      case TooltipPosition.bottomEnd:
        this.verticalDefaultPosition = "bottom";
        this.horizontalDefaultPosition = "end";
        break;
      default:
        this.verticalPositioningMode = "dynamic";
        this.horizontalPositioningMode = "dynamic";
        this.verticalDefaultPosition = void 0;
        this.horizontalDefaultPosition = "center";
        break;
    }
  }
};
__decorate([
  attr({ mode: "boolean" })
], Tooltip.prototype, "visible", void 0);
__decorate([
  attr
], Tooltip.prototype, "anchor", void 0);
__decorate([
  attr
], Tooltip.prototype, "delay", void 0);
__decorate([
  attr
], Tooltip.prototype, "position", void 0);
__decorate([
  attr({ attribute: "auto-update-mode" })
], Tooltip.prototype, "autoUpdateMode", void 0);
__decorate([
  attr({ attribute: "horizontal-viewport-lock" })
], Tooltip.prototype, "horizontalViewportLock", void 0);
__decorate([
  attr({ attribute: "vertical-viewport-lock" })
], Tooltip.prototype, "verticalViewportLock", void 0);
__decorate([
  observable
], Tooltip.prototype, "anchorElement", void 0);
__decorate([
  observable
], Tooltip.prototype, "viewportElement", void 0);
__decorate([
  observable
], Tooltip.prototype, "verticalPositioningMode", void 0);
__decorate([
  observable
], Tooltip.prototype, "horizontalPositioningMode", void 0);
__decorate([
  observable
], Tooltip.prototype, "horizontalInset", void 0);
__decorate([
  observable
], Tooltip.prototype, "verticalInset", void 0);
__decorate([
  observable
], Tooltip.prototype, "horizontalScaling", void 0);
__decorate([
  observable
], Tooltip.prototype, "verticalScaling", void 0);
__decorate([
  observable
], Tooltip.prototype, "verticalDefaultPosition", void 0);
__decorate([
  observable
], Tooltip.prototype, "horizontalDefaultPosition", void 0);
__decorate([
  observable
], Tooltip.prototype, "tooltipVisible", void 0);
__decorate([
  observable
], Tooltip.prototype, "currentDirection", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tree-item/tree-item.template.js
var treeItemTemplate = (context, definition) => html2`
    <template
        role="treeitem"
        slot="${(x) => x.isNestedItem() ? "item" : void 0}"
        tabindex="-1"
        class="${(x) => x.expanded ? "expanded" : ""} ${(x) => x.selected ? "selected" : ""} ${(x) => x.nested ? "nested" : ""}
            ${(x) => x.disabled ? "disabled" : ""}"
        aria-expanded="${(x) => x.childItems && x.childItemLength() > 0 ? x.expanded : void 0}"
        aria-selected="${(x) => x.selected}"
        aria-disabled="${(x) => x.disabled}"
        @focusin="${(x, c) => x.handleFocus(c.event)}"
        @focusout="${(x, c) => x.handleBlur(c.event)}"
        ${children({
  property: "childItems",
  filter: elements()
})}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${when((x) => x.childItems && x.childItemLength() > 0, html2`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(x, c) => x.handleExpandCollapseButtonClick(c.event)}"
                            ${ref("expandCollapseButton")}
                        >
                            <slot name="expand-collapse-glyph">
                                ${definition.expandCollapseGlyph || ""}
                            </slot>
                        </div>
                    `)}
                ${startSlotTemplate(context, definition)}
                <slot></slot>
                ${endSlotTemplate(context, definition)}
            </div>
        </div>
        ${when((x) => x.childItems && x.childItemLength() > 0 && (x.expanded || x.renderCollapsedChildren), html2`
                <div role="group" class="items" part="items">
                    <slot name="item" ${slotted("items")}></slot>
                </div>
            `)}
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tree-item/tree-item.js
function isTreeItemElement(el) {
  return isHTMLElement(el) && el.getAttribute("role") === "treeitem";
}
var TreeItem = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.expanded = false;
    this.focusable = false;
    this.isNestedItem = () => {
      return isTreeItemElement(this.parentElement);
    };
    this.handleExpandCollapseButtonClick = (e) => {
      if (!this.disabled && !e.defaultPrevented) {
        this.expanded = !this.expanded;
      }
    };
    this.handleFocus = (e) => {
      this.setAttribute("tabindex", "0");
    };
    this.handleBlur = (e) => {
      this.setAttribute("tabindex", "-1");
    };
  }
  expandedChanged() {
    if (this.$fastController.isConnected) {
      this.$emit("expanded-change", this);
    }
  }
  selectedChanged() {
    if (this.$fastController.isConnected) {
      this.$emit("selected-change", this);
    }
  }
  itemsChanged(oldValue, newValue) {
    if (this.$fastController.isConnected) {
      this.items.forEach((node) => {
        if (isTreeItemElement(node)) {
          node.nested = true;
        }
      });
    }
  }
  /**
   * Places document focus on a tree item
   *
   * @public
   * @param el - the element to focus
   */
  static focusItem(el) {
    el.focusable = true;
    el.focus();
  }
  /**
   * Gets number of children
   *
   * @internal
   */
  childItemLength() {
    const treeChildren = this.childItems.filter((item) => {
      return isTreeItemElement(item);
    });
    return treeChildren ? treeChildren.length : 0;
  }
};
__decorate([
  attr({ mode: "boolean" })
], TreeItem.prototype, "expanded", void 0);
__decorate([
  attr({ mode: "boolean" })
], TreeItem.prototype, "selected", void 0);
__decorate([
  attr({ mode: "boolean" })
], TreeItem.prototype, "disabled", void 0);
__decorate([
  observable
], TreeItem.prototype, "focusable", void 0);
__decorate([
  observable
], TreeItem.prototype, "childItems", void 0);
__decorate([
  observable
], TreeItem.prototype, "items", void 0);
__decorate([
  observable
], TreeItem.prototype, "nested", void 0);
__decorate([
  observable
], TreeItem.prototype, "renderCollapsedChildren", void 0);
applyMixins(TreeItem, StartEnd);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tree-view/tree-view.template.js
var treeViewTemplate = (context, definition) => html2`
    <template
        role="tree"
        ${ref("treeView")}
        @keydown="${(x, c) => x.handleKeyDown(c.event)}"
        @focusin="${(x, c) => x.handleFocus(c.event)}"
        @focusout="${(x, c) => x.handleBlur(c.event)}"
        @click="${(x, c) => x.handleClick(c.event)}"
        @selected-change="${(x, c) => x.handleSelectedChange(c.event)}"
    >
        <slot ${slotted("slottedTreeItems")}></slot>
    </template>
`;

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/tree-view/tree-view.js
var TreeView = class extends FoundationElement {
  constructor() {
    super(...arguments);
    this.currentFocused = null;
    this.handleFocus = (e) => {
      if (this.slottedTreeItems.length < 1) {
        return;
      }
      if (e.target === this) {
        if (this.currentFocused === null) {
          this.currentFocused = this.getValidFocusableItem();
        }
        if (this.currentFocused !== null) {
          TreeItem.focusItem(this.currentFocused);
        }
        return;
      }
      if (this.contains(e.target)) {
        this.setAttribute("tabindex", "-1");
        this.currentFocused = e.target;
      }
    };
    this.handleBlur = (e) => {
      if (e.target instanceof HTMLElement && (e.relatedTarget === null || !this.contains(e.relatedTarget))) {
        this.setAttribute("tabindex", "0");
      }
    };
    this.handleKeyDown = (e) => {
      if (e.defaultPrevented) {
        return;
      }
      if (this.slottedTreeItems.length < 1) {
        return true;
      }
      const treeItems = this.getVisibleNodes();
      switch (e.key) {
        case keyHome:
          if (treeItems.length) {
            TreeItem.focusItem(treeItems[0]);
          }
          return;
        case keyEnd:
          if (treeItems.length) {
            TreeItem.focusItem(treeItems[treeItems.length - 1]);
          }
          return;
        case keyArrowLeft:
          if (e.target && this.isFocusableElement(e.target)) {
            const item = e.target;
            if (item instanceof TreeItem && item.childItemLength() > 0 && item.expanded) {
              item.expanded = false;
            } else if (item instanceof TreeItem && item.parentElement instanceof TreeItem) {
              TreeItem.focusItem(item.parentElement);
            }
          }
          return false;
        case keyArrowRight:
          if (e.target && this.isFocusableElement(e.target)) {
            const item = e.target;
            if (item instanceof TreeItem && item.childItemLength() > 0 && !item.expanded) {
              item.expanded = true;
            } else if (item instanceof TreeItem && item.childItemLength() > 0) {
              this.focusNextNode(1, e.target);
            }
          }
          return;
        case keyArrowDown:
          if (e.target && this.isFocusableElement(e.target)) {
            this.focusNextNode(1, e.target);
          }
          return;
        case keyArrowUp:
          if (e.target && this.isFocusableElement(e.target)) {
            this.focusNextNode(-1, e.target);
          }
          return;
        case keyEnter:
          this.handleClick(e);
          return;
      }
      return true;
    };
    this.handleSelectedChange = (e) => {
      if (e.defaultPrevented) {
        return;
      }
      if (!(e.target instanceof Element) || !isTreeItemElement(e.target)) {
        return true;
      }
      const item = e.target;
      if (item.selected) {
        if (this.currentSelected && this.currentSelected !== item) {
          this.currentSelected.selected = false;
        }
        this.currentSelected = item;
      } else if (!item.selected && this.currentSelected === item) {
        this.currentSelected = null;
      }
      return;
    };
    this.setItems = () => {
      const selectedItem = this.treeView.querySelector("[aria-selected='true']");
      this.currentSelected = selectedItem;
      if (this.currentFocused === null || !this.contains(this.currentFocused)) {
        this.currentFocused = this.getValidFocusableItem();
      }
      this.nested = this.checkForNestedItems();
      const treeItems = this.getVisibleNodes();
      treeItems.forEach((node) => {
        if (isTreeItemElement(node)) {
          node.nested = this.nested;
        }
      });
    };
    this.isFocusableElement = (el) => {
      return isTreeItemElement(el);
    };
    this.isSelectedElement = (el) => {
      return el.selected;
    };
  }
  slottedTreeItemsChanged() {
    if (this.$fastController.isConnected) {
      this.setItems();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
    DOM.queueUpdate(() => {
      this.setItems();
    });
  }
  /**
   * Handles click events bubbling up
   *
   *  @internal
   */
  handleClick(e) {
    if (e.defaultPrevented) {
      return;
    }
    if (!(e.target instanceof Element) || !isTreeItemElement(e.target)) {
      return true;
    }
    const item = e.target;
    if (!item.disabled) {
      item.selected = !item.selected;
    }
    return;
  }
  /**
   * Move focus to a tree item based on its offset from the provided item
   */
  focusNextNode(delta, item) {
    const visibleNodes = this.getVisibleNodes();
    if (!visibleNodes) {
      return;
    }
    const focusItem = visibleNodes[visibleNodes.indexOf(item) + delta];
    if (isHTMLElement(focusItem)) {
      TreeItem.focusItem(focusItem);
    }
  }
  /**
   * checks if there are any nested tree items
   */
  getValidFocusableItem() {
    const treeItems = this.getVisibleNodes();
    let focusIndex = treeItems.findIndex(this.isSelectedElement);
    if (focusIndex === -1) {
      focusIndex = treeItems.findIndex(this.isFocusableElement);
    }
    if (focusIndex !== -1) {
      return treeItems[focusIndex];
    }
    return null;
  }
  /**
   * checks if there are any nested tree items
   */
  checkForNestedItems() {
    return this.slottedTreeItems.some((node) => {
      return isTreeItemElement(node) && node.querySelector("[role='treeitem']");
    });
  }
  getVisibleNodes() {
    return getDisplayedNodes(this, "[role='treeitem']") || [];
  }
};
__decorate([
  attr({ attribute: "render-collapsed-nodes" })
], TreeView.prototype, "renderCollapsedNodes", void 0);
__decorate([
  observable
], TreeView.prototype, "currentSelected", void 0);
__decorate([
  observable
], TreeView.prototype, "slottedTreeItems", void 0);

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/match-media-stylesheet-behavior.js
var MatchMediaBehavior = class {
  /**
   *
   * @param query - The media query to operate from.
   */
  constructor(query) {
    this.listenerCache = /* @__PURE__ */ new WeakMap();
    this.query = query;
  }
  /**
   * Binds the behavior to the element.
   * @param source - The element for which the behavior is bound.
   */
  bind(source) {
    const { query } = this;
    const listener = this.constructListener(source);
    listener.bind(query)();
    query.addListener(listener);
    this.listenerCache.set(source, listener);
  }
  /**
   * Unbinds the behavior from the element.
   * @param source - The element for which the behavior is unbinding.
   */
  unbind(source) {
    const listener = this.listenerCache.get(source);
    if (listener) {
      this.query.removeListener(listener);
      this.listenerCache.delete(source);
    }
  }
};
var MatchMediaStyleSheetBehavior = class _MatchMediaStyleSheetBehavior extends MatchMediaBehavior {
  /**
   * Constructs a {@link MatchMediaStyleSheetBehavior} instance.
   * @param query - The media query to operate from.
   * @param styles - The styles to coordinate with the query.
   */
  constructor(query, styles) {
    super(query);
    this.styles = styles;
  }
  /**
   * Defines a function to construct {@link MatchMediaStyleSheetBehavior | MatchMediaStyleSheetBehaviors} for
   * a provided query.
   * @param query - The media query to operate from.
   *
   * @public
   * @example
   *
   * ```ts
   * import { css } from "@microsoft/fast-element";
   * import { MatchMediaStyleSheetBehavior } from "@microsoft/fast-foundation";
   *
   * const landscapeBehavior = MatchMediaStyleSheetBehavior.with(
   *   window.matchMedia("(orientation: landscape)")
   * );
   * const styles = css`
   *   :host {
   *     width: 200px;
   *     height: 400px;
   *   }
   * `
   * .withBehaviors(landscapeBehavior(css`
   *   :host {
   *     width: 400px;
   *     height: 200px;
   *   }
   * `))
   * ```
   */
  static with(query) {
    return (styles) => {
      return new _MatchMediaStyleSheetBehavior(query, styles);
    };
  }
  /**
   * Constructs a match-media listener for a provided element.
   * @param source - the element for which to attach or detach styles.
   * @internal
   */
  constructListener(source) {
    let attached = false;
    const styles = this.styles;
    return function listener() {
      const { matches: matches2 } = this;
      if (matches2 && !attached) {
        source.$fastController.addStyles(styles);
        attached = matches2;
      } else if (!matches2 && attached) {
        source.$fastController.removeStyles(styles);
        attached = matches2;
      }
    };
  }
  /**
   * Unbinds the behavior from the element.
   * @param source - The element for which the behavior is unbinding.
   * @internal
   */
  unbind(source) {
    super.unbind(source);
    source.$fastController.removeStyles(this.styles);
  }
};
var forcedColorsStylesheetBehavior = MatchMediaStyleSheetBehavior.with(window.matchMedia("(forced-colors)"));
var darkModeStylesheetBehavior = MatchMediaStyleSheetBehavior.with(window.matchMedia("(prefers-color-scheme: dark)"));
var lightModeStylesheetBehavior = MatchMediaStyleSheetBehavior.with(window.matchMedia("(prefers-color-scheme: light)"));

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/property-stylesheet-behavior.js
var PropertyStyleSheetBehavior = class {
  /**
   * Constructs a {@link PropertyStyleSheetBehavior} instance.
   * @param propertyName - The property name to operate from.
   * @param value - The property value to operate from.
   * @param styles - The styles to coordinate with the property.
   */
  constructor(propertyName, value, styles) {
    this.propertyName = propertyName;
    this.value = value;
    this.styles = styles;
  }
  /**
   * Binds the behavior to the element.
   * @param elementInstance - The element for which the property is applied.
   */
  bind(elementInstance) {
    Observable.getNotifier(elementInstance).subscribe(this, this.propertyName);
    this.handleChange(elementInstance, this.propertyName);
  }
  /**
   * Unbinds the behavior from the element.
   * @param source - The element for which the behavior is unbinding.
   * @internal
   */
  unbind(source) {
    Observable.getNotifier(source).unsubscribe(this, this.propertyName);
    source.$fastController.removeStyles(this.styles);
  }
  /**
   * Change event for the provided element.
   * @param source - the element for which to attach or detach styles.
   * @param key - the key to lookup to know if the element already has the styles
   * @internal
   */
  handleChange(source, key) {
    if (source[key] === this.value) {
      source.$fastController.addStyles(this.styles);
    } else {
      source.$fastController.removeStyles(this.styles);
    }
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/disabled.js
var disabledCursor = "not-allowed";

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/display.js
var hidden = `:host([hidden]){display:none}`;
function display(displayValue) {
  return `${hidden}:host{display:${displayValue}}`;
}

// ../web-component-sdk/node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/focus.js
var focusVisible = canUseFocusVisible() ? "focus-visible" : "focus";

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/math-utilities.js
function clamp(i, min, max) {
  if (isNaN(i) || i <= min) {
    return min;
  } else if (i >= max) {
    return max;
  }
  return i;
}
function normalize(i, min, max) {
  if (isNaN(i) || i <= min) {
    return 0;
  } else if (i >= max) {
    return 1;
  }
  return i / (max - min);
}
function denormalize(i, min, max) {
  if (isNaN(i)) {
    return min;
  }
  return min + i * (max - min);
}
function degreesToRadians(i) {
  return i * (Math.PI / 180);
}
function radiansToDegrees(i) {
  return i * (180 / Math.PI);
}
function getHexStringForByte(i) {
  const s = Math.round(clamp(i, 0, 255)).toString(16);
  if (s.length === 1) {
    return "0" + s;
  }
  return s;
}
function lerp(i, min, max) {
  if (isNaN(i) || i <= 0) {
    return min;
  } else if (i >= 1) {
    return max;
  }
  return min + i * (max - min);
}
function lerpAnglesInDegrees(i, min, max) {
  if (i <= 0) {
    return min % 360;
  } else if (i >= 1) {
    return max % 360;
  }
  const a = (min - max + 360) % 360;
  const b = (max - min + 360) % 360;
  if (a <= b) {
    return (min - a * i + 360) % 360;
  }
  return (min + a * i + 360) % 360;
}
var TwoPI = Math.PI * 2;
function roundToPrecisionSmall(i, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(i * factor) / factor;
}

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-hsl.js
var ColorHSL = class _ColorHSL {
  constructor(hue, sat, lum) {
    this.h = hue;
    this.s = sat;
    this.l = lum;
  }
  /**
   * Construct a {@link ColorHSL} from a config object.
   */
  static fromObject(data) {
    if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.l)) {
      return new _ColorHSL(data.h, data.s, data.l);
    }
    return null;
  }
  /**
   * Determines if a color is equal to another
   * @param rhs - the value to compare
   */
  equalValue(rhs) {
    return this.h === rhs.h && this.s === rhs.s && this.l === rhs.l;
  }
  /**
   * Returns a new {@link ColorHSL} rounded to the provided precision
   * @param precision - the precision to round to
   */
  roundToPrecision(precision) {
    return new _ColorHSL(roundToPrecisionSmall(this.h, precision), roundToPrecisionSmall(this.s, precision), roundToPrecisionSmall(this.l, precision));
  }
  /**
   * Returns the {@link ColorHSL} formatted as an object.
   */
  toObject() {
    return { h: this.h, s: this.s, l: this.l };
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-hsv.js
var ColorHSV = class _ColorHSV {
  constructor(hue, sat, val) {
    this.h = hue;
    this.s = sat;
    this.v = val;
  }
  /**
   * Construct a {@link ColorHSV} from a config object.
   */
  static fromObject(data) {
    if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.v)) {
      return new _ColorHSV(data.h, data.s, data.v);
    }
    return null;
  }
  /**
   * Determines if a color is equal to another
   * @param rhs - the value to compare
   */
  equalValue(rhs) {
    return this.h === rhs.h && this.s === rhs.s && this.v === rhs.v;
  }
  /**
   * Returns a new {@link ColorHSV} rounded to the provided precision
   * @param precision - the precision to round to
   */
  roundToPrecision(precision) {
    return new _ColorHSV(roundToPrecisionSmall(this.h, precision), roundToPrecisionSmall(this.s, precision), roundToPrecisionSmall(this.v, precision));
  }
  /**
   * Returns the {@link ColorHSV} formatted as an object.
   */
  toObject() {
    return { h: this.h, s: this.s, v: this.v };
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-lab.js
var ColorLAB = class _ColorLAB {
  constructor(l, a, b) {
    this.l = l;
    this.a = a;
    this.b = b;
  }
  /**
   * Construct a {@link ColorLAB} from a config object.
   */
  static fromObject(data) {
    if (data && !isNaN(data.l) && !isNaN(data.a) && !isNaN(data.b)) {
      return new _ColorLAB(data.l, data.a, data.b);
    }
    return null;
  }
  /**
   * Determines if a color is equal to another
   * @param rhs - the value to compare
   */
  equalValue(rhs) {
    return this.l === rhs.l && this.a === rhs.a && this.b === rhs.b;
  }
  /**
   * Returns a new {@link ColorLAB} rounded to the provided precision
   * @param precision - the precision to round to
   */
  roundToPrecision(precision) {
    return new _ColorLAB(roundToPrecisionSmall(this.l, precision), roundToPrecisionSmall(this.a, precision), roundToPrecisionSmall(this.b, precision));
  }
  /**
   * Returns the {@link ColorLAB} formatted as an object.
   */
  toObject() {
    return { l: this.l, a: this.a, b: this.b };
  }
};
ColorLAB.epsilon = 216 / 24389;
ColorLAB.kappa = 24389 / 27;

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-lch.js
var ColorLCH = class _ColorLCH {
  constructor(l, c, h) {
    this.l = l;
    this.c = c;
    this.h = h;
  }
  /**
   * Construct a {@link ColorLCH} from a config object.
   * @param data - the config object
   */
  static fromObject(data) {
    if (data && !isNaN(data.l) && !isNaN(data.c) && !isNaN(data.h)) {
      return new _ColorLCH(data.l, data.c, data.h);
    }
    return null;
  }
  /**
   * Determines if one color is equal to another.
   * @param rhs - the color to compare
   */
  equalValue(rhs) {
    return this.l === rhs.l && this.c === rhs.c && this.h === rhs.h;
  }
  /**
   * Returns a new {@link ColorLCH} rounded to the provided precision
   * @param precision - the precision to round to
   */
  roundToPrecision(precision) {
    return new _ColorLCH(roundToPrecisionSmall(this.l, precision), roundToPrecisionSmall(this.c, precision), roundToPrecisionSmall(this.h, precision));
  }
  /**
   * Converts the {@link ColorLCH} to a config object.
   */
  toObject() {
    return { l: this.l, c: this.c, h: this.h };
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-rgba-64.js
var ColorRGBA64 = class _ColorRGBA64 {
  /**
   *
   * @param red - the red value
   * @param green - the green value
   * @param blue - the blue value
   * @param alpha - the alpha value
   */
  constructor(red, green, blue, alpha) {
    this.r = red;
    this.g = green;
    this.b = blue;
    this.a = typeof alpha === "number" && !isNaN(alpha) ? alpha : 1;
  }
  /**
   * Construct a {@link ColorRGBA64} from a {@link ColorRGBA64Config}
   * @param data - the config object
   */
  static fromObject(data) {
    return data && !isNaN(data.r) && !isNaN(data.g) && !isNaN(data.b) ? new _ColorRGBA64(data.r, data.g, data.b, data.a) : null;
  }
  /**
   * Determines if one color is equal to another.
   * @param rhs - the color to compare
   */
  equalValue(rhs) {
    return this.r === rhs.r && this.g === rhs.g && this.b === rhs.b && this.a === rhs.a;
  }
  /**
   * Returns the color formatted as a string; #RRGGBB
   */
  toStringHexRGB() {
    return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("");
  }
  /**
   * Returns the color formatted as a string; #RRGGBBAA
   */
  toStringHexRGBA() {
    return this.toStringHexRGB() + this.formatHexValue(this.a);
  }
  /**
   * Returns the color formatted as a string; #AARRGGBB
   */
  toStringHexARGB() {
    return "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("");
  }
  /**
   * Returns the color formatted as a string; "rgb(0xRR, 0xGG, 0xBB)"
   */
  toStringWebRGB() {
    return `rgb(${Math.round(denormalize(this.r, 0, 255))},${Math.round(denormalize(this.g, 0, 255))},${Math.round(denormalize(this.b, 0, 255))})`;
  }
  /**
   * Returns the color formatted as a string; "rgba(0xRR, 0xGG, 0xBB, a)"
   * @remarks
   * Note that this follows the convention of putting alpha in the range [0.0,1.0] while the other three channels are [0,255]
   */
  toStringWebRGBA() {
    return `rgba(${Math.round(denormalize(this.r, 0, 255))},${Math.round(denormalize(this.g, 0, 255))},${Math.round(denormalize(this.b, 0, 255))},${clamp(this.a, 0, 1)})`;
  }
  /**
   * Returns a new {@link ColorRGBA64} rounded to the provided precision
   * @param precision - the precision to round to
   */
  roundToPrecision(precision) {
    return new _ColorRGBA64(roundToPrecisionSmall(this.r, precision), roundToPrecisionSmall(this.g, precision), roundToPrecisionSmall(this.b, precision), roundToPrecisionSmall(this.a, precision));
  }
  /**
   * Returns a new {@link ColorRGBA64} with channel values clamped between 0 and 1.
   */
  clamp() {
    return new _ColorRGBA64(clamp(this.r, 0, 1), clamp(this.g, 0, 1), clamp(this.b, 0, 1), clamp(this.a, 0, 1));
  }
  /**
   * Converts the {@link ColorRGBA64} to a {@link ColorRGBA64Config}.
   */
  toObject() {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
  }
  formatHexValue(value) {
    return getHexStringForByte(denormalize(value, 0, 255));
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-xyz.js
var ColorXYZ = class _ColorXYZ {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * Construct a {@link ColorXYZ} from a config object.
   */
  static fromObject(data) {
    if (data && !isNaN(data.x) && !isNaN(data.y) && !isNaN(data.z)) {
      return new _ColorXYZ(data.x, data.y, data.z);
    }
    return null;
  }
  /**
   * Determines if a color is equal to another
   * @param rhs - the value to compare
   */
  equalValue(rhs) {
    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
  }
  /**
   * Returns a new {@link ColorXYZ} rounded to the provided precision
   * @param precision - the precision to round to
   */
  roundToPrecision(precision) {
    return new _ColorXYZ(roundToPrecisionSmall(this.x, precision), roundToPrecisionSmall(this.y, precision), roundToPrecisionSmall(this.z, precision));
  }
  /**
   * Returns the {@link ColorXYZ} formatted as an object.
   */
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }
};
ColorXYZ.whitePoint = new ColorXYZ(0.95047, 1, 1.08883);

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-converters.js
function rgbToLinearLuminance(rgb) {
  return rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722;
}
function rgbToRelativeLuminance(rgb) {
  function luminanceHelper(i) {
    if (i <= 0.03928) {
      return i / 12.92;
    }
    return Math.pow((i + 0.055) / 1.055, 2.4);
  }
  return rgbToLinearLuminance(new ColorRGBA64(luminanceHelper(rgb.r), luminanceHelper(rgb.g), luminanceHelper(rgb.b), 1));
}
var calculateContrastRatio = (a, b) => (a + 0.05) / (b + 0.05);
function contrastRatio(a, b) {
  const luminanceA = rgbToRelativeLuminance(a);
  const luminanceB = rgbToRelativeLuminance(b);
  return luminanceA > luminanceB ? calculateContrastRatio(luminanceA, luminanceB) : calculateContrastRatio(luminanceB, luminanceA);
}
function calcChannelOverlay(match, background, overlay) {
  if (overlay - background === 0) {
    return 0;
  } else {
    return (match - background) / (overlay - background);
  }
}
function calcRgbOverlay(rgbMatch, rgbBackground, rgbOverlay) {
  const rChannel = calcChannelOverlay(rgbMatch.r, rgbBackground.r, rgbOverlay.r);
  const gChannel = calcChannelOverlay(rgbMatch.g, rgbBackground.g, rgbOverlay.g);
  const bChannel = calcChannelOverlay(rgbMatch.b, rgbBackground.b, rgbOverlay.b);
  return (rChannel + gChannel + bChannel) / 3;
}
function calculateOverlayColor(rgbMatch, rgbBackground, rgbOverlay = null) {
  let alpha = 0;
  let overlay = rgbOverlay;
  if (overlay !== null) {
    alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
  } else {
    overlay = new ColorRGBA64(0, 0, 0, 1);
    alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    if (alpha <= 0) {
      overlay = new ColorRGBA64(1, 1, 1, 1);
      alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    }
  }
  alpha = Math.round(alpha * 1e3) / 1e3;
  return new ColorRGBA64(overlay.r, overlay.g, overlay.b, alpha);
}
function rgbToHSL(rgb) {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  let hue = 0;
  if (delta !== 0) {
    if (max === rgb.r) {
      hue = 60 * ((rgb.g - rgb.b) / delta % 6);
    } else if (max === rgb.g) {
      hue = 60 * ((rgb.b - rgb.r) / delta + 2);
    } else {
      hue = 60 * ((rgb.r - rgb.g) / delta + 4);
    }
  }
  if (hue < 0) {
    hue += 360;
  }
  const lum = (max + min) / 2;
  let sat = 0;
  if (delta !== 0) {
    sat = delta / (1 - Math.abs(2 * lum - 1));
  }
  return new ColorHSL(hue, sat, lum);
}
function hslToRGB(hsl, alpha = 1) {
  const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
  const x = c * (1 - Math.abs(hsl.h / 60 % 2 - 1));
  const m = hsl.l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hsl.h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hsl.h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hsl.h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hsl.h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hsl.h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (hsl.h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  return new ColorRGBA64(r + m, g + m, b + m, alpha);
}
function rgbToHSV(rgb) {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  let hue = 0;
  if (delta !== 0) {
    if (max === rgb.r) {
      hue = 60 * ((rgb.g - rgb.b) / delta % 6);
    } else if (max === rgb.g) {
      hue = 60 * ((rgb.b - rgb.r) / delta + 2);
    } else {
      hue = 60 * ((rgb.r - rgb.g) / delta + 4);
    }
  }
  if (hue < 0) {
    hue += 360;
  }
  let sat = 0;
  if (max !== 0) {
    sat = delta / max;
  }
  return new ColorHSV(hue, sat, max);
}
function hsvToRGB(hsv, alpha = 1) {
  const c = hsv.s * hsv.v;
  const x = c * (1 - Math.abs(hsv.h / 60 % 2 - 1));
  const m = hsv.v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hsv.h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hsv.h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hsv.h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hsv.h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hsv.h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (hsv.h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  return new ColorRGBA64(r + m, g + m, b + m, alpha);
}
function lchToLAB(lch) {
  let a = 0;
  let b = 0;
  if (lch.h !== 0) {
    a = Math.cos(degreesToRadians(lch.h)) * lch.c;
    b = Math.sin(degreesToRadians(lch.h)) * lch.c;
  }
  return new ColorLAB(lch.l, a, b);
}
function labToLCH(lab) {
  let h = 0;
  if (Math.abs(lab.b) > 1e-3 || Math.abs(lab.a) > 1e-3) {
    h = radiansToDegrees(Math.atan2(lab.b, lab.a));
  }
  if (h < 0) {
    h += 360;
  }
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  return new ColorLCH(lab.l, c, h);
}
function labToXYZ(lab) {
  const fy = (lab.l + 16) / 116;
  const fx = fy + lab.a / 500;
  const fz = fy - lab.b / 200;
  const xcubed = Math.pow(fx, 3);
  const ycubed = Math.pow(fy, 3);
  const zcubed = Math.pow(fz, 3);
  let x = 0;
  if (xcubed > ColorLAB.epsilon) {
    x = xcubed;
  } else {
    x = (116 * fx - 16) / ColorLAB.kappa;
  }
  let y = 0;
  if (lab.l > ColorLAB.epsilon * ColorLAB.kappa) {
    y = ycubed;
  } else {
    y = lab.l / ColorLAB.kappa;
  }
  let z = 0;
  if (zcubed > ColorLAB.epsilon) {
    z = zcubed;
  } else {
    z = (116 * fz - 16) / ColorLAB.kappa;
  }
  x = ColorXYZ.whitePoint.x * x;
  y = ColorXYZ.whitePoint.y * y;
  z = ColorXYZ.whitePoint.z * z;
  return new ColorXYZ(x, y, z);
}
function xyzToLAB(xyz) {
  function xyzToLABHelper(i) {
    if (i > ColorLAB.epsilon) {
      return Math.pow(i, 1 / 3);
    }
    return (ColorLAB.kappa * i + 16) / 116;
  }
  const x = xyzToLABHelper(xyz.x / ColorXYZ.whitePoint.x);
  const y = xyzToLABHelper(xyz.y / ColorXYZ.whitePoint.y);
  const z = xyzToLABHelper(xyz.z / ColorXYZ.whitePoint.z);
  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return new ColorLAB(l, a, b);
}
function rgbToXYZ(rgb) {
  function rgbToXYZHelper(i) {
    if (i <= 0.04045) {
      return i / 12.92;
    }
    return Math.pow((i + 0.055) / 1.055, 2.4);
  }
  const r = rgbToXYZHelper(rgb.r);
  const g = rgbToXYZHelper(rgb.g);
  const b = rgbToXYZHelper(rgb.b);
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
  return new ColorXYZ(x, y, z);
}
function xyzToRGB(xyz, alpha = 1) {
  function xyzToRGBHelper(i) {
    if (i <= 31308e-7) {
      return i * 12.92;
    }
    return 1.055 * Math.pow(i, 1 / 2.4) - 0.055;
  }
  const r = xyzToRGBHelper(xyz.x * 3.2404542 - xyz.y * 1.5371385 - xyz.z * 0.4985314);
  const g = xyzToRGBHelper(xyz.x * -0.969266 + xyz.y * 1.8760108 + xyz.z * 0.041556);
  const b = xyzToRGBHelper(xyz.x * 0.0556434 - xyz.y * 0.2040259 + xyz.z * 1.0572252);
  return new ColorRGBA64(r, g, b, alpha);
}
function rgbToLAB(rgb) {
  return xyzToLAB(rgbToXYZ(rgb));
}
function labToRGB(lab, alpha = 1) {
  return xyzToRGB(labToXYZ(lab), alpha);
}
function rgbToLCH(rgb) {
  return labToLCH(rgbToLAB(rgb));
}
function lchToRGB(lch, alpha = 1) {
  return labToRGB(lchToLAB(lch), alpha);
}

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-blending.js
function saturateViaLCH(input, saturation, saturationConstant = 18) {
  const lch = rgbToLCH(input);
  let sat = lch.c + saturation * saturationConstant;
  if (sat < 0) {
    sat = 0;
  }
  return lchToRGB(new ColorLCH(lch.l, sat, lch.h));
}
function blendMultiplyChannel(bottom, top) {
  return bottom * top;
}
function blendMultiply(bottom, top) {
  return new ColorRGBA64(blendMultiplyChannel(bottom.r, top.r), blendMultiplyChannel(bottom.g, top.g), blendMultiplyChannel(bottom.b, top.b), 1);
}
function blendOverlayChannel(bottom, top) {
  if (bottom < 0.5) {
    return clamp(2 * top * bottom, 0, 1);
  }
  return clamp(1 - 2 * (1 - top) * (1 - bottom), 0, 1);
}
function blendOverlay(bottom, top) {
  return new ColorRGBA64(blendOverlayChannel(bottom.r, top.r), blendOverlayChannel(bottom.g, top.g), blendOverlayChannel(bottom.b, top.b), 1);
}
var ColorBlendMode;
(function(ColorBlendMode2) {
  ColorBlendMode2[ColorBlendMode2["Burn"] = 0] = "Burn";
  ColorBlendMode2[ColorBlendMode2["Color"] = 1] = "Color";
  ColorBlendMode2[ColorBlendMode2["Darken"] = 2] = "Darken";
  ColorBlendMode2[ColorBlendMode2["Dodge"] = 3] = "Dodge";
  ColorBlendMode2[ColorBlendMode2["Lighten"] = 4] = "Lighten";
  ColorBlendMode2[ColorBlendMode2["Multiply"] = 5] = "Multiply";
  ColorBlendMode2[ColorBlendMode2["Overlay"] = 6] = "Overlay";
  ColorBlendMode2[ColorBlendMode2["Screen"] = 7] = "Screen";
})(ColorBlendMode || (ColorBlendMode = {}));
function computeAlphaBlend(bottom, top) {
  if (top.a >= 1) {
    return top;
  } else if (top.a <= 0) {
    return new ColorRGBA64(bottom.r, bottom.g, bottom.b, 1);
  }
  const r = top.a * top.r + (1 - top.a) * bottom.r;
  const g = top.a * top.g + (1 - top.a) * bottom.g;
  const b = top.a * top.b + (1 - top.a) * bottom.b;
  return new ColorRGBA64(r, g, b, 1);
}

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-interpolation.js
function interpolateRGB(position, left, right) {
  if (isNaN(position) || position <= 0) {
    return left;
  } else if (position >= 1) {
    return right;
  }
  return new ColorRGBA64(lerp(position, left.r, right.r), lerp(position, left.g, right.g), lerp(position, left.b, right.b), lerp(position, left.a, right.a));
}
function interpolateHSL(position, left, right) {
  if (isNaN(position) || position <= 0) {
    return left;
  } else if (position >= 1) {
    return right;
  }
  return new ColorHSL(lerpAnglesInDegrees(position, left.h, right.h), lerp(position, left.s, right.s), lerp(position, left.l, right.l));
}
function interpolateHSV(position, left, right) {
  if (isNaN(position) || position <= 0) {
    return left;
  } else if (position >= 1) {
    return right;
  }
  return new ColorHSV(lerpAnglesInDegrees(position, left.h, right.h), lerp(position, left.s, right.s), lerp(position, left.v, right.v));
}
function interpolateXYZ(position, left, right) {
  if (isNaN(position) || position <= 0) {
    return left;
  } else if (position >= 1) {
    return right;
  }
  return new ColorXYZ(lerp(position, left.x, right.x), lerp(position, left.y, right.y), lerp(position, left.z, right.z));
}
function interpolateLAB(position, left, right) {
  if (isNaN(position) || position <= 0) {
    return left;
  } else if (position >= 1) {
    return right;
  }
  return new ColorLAB(lerp(position, left.l, right.l), lerp(position, left.a, right.a), lerp(position, left.b, right.b));
}
function interpolateLCH(position, left, right) {
  if (isNaN(position) || position <= 0) {
    return left;
  } else if (position >= 1) {
    return right;
  }
  return new ColorLCH(lerp(position, left.l, right.l), lerp(position, left.c, right.c), lerpAnglesInDegrees(position, left.h, right.h));
}
var ColorInterpolationSpace;
(function(ColorInterpolationSpace2) {
  ColorInterpolationSpace2[ColorInterpolationSpace2["RGB"] = 0] = "RGB";
  ColorInterpolationSpace2[ColorInterpolationSpace2["HSL"] = 1] = "HSL";
  ColorInterpolationSpace2[ColorInterpolationSpace2["HSV"] = 2] = "HSV";
  ColorInterpolationSpace2[ColorInterpolationSpace2["XYZ"] = 3] = "XYZ";
  ColorInterpolationSpace2[ColorInterpolationSpace2["LAB"] = 4] = "LAB";
  ColorInterpolationSpace2[ColorInterpolationSpace2["LCH"] = 5] = "LCH";
})(ColorInterpolationSpace || (ColorInterpolationSpace = {}));
function interpolateByColorSpace(position, space, left, right) {
  if (isNaN(position) || position <= 0) {
    return left;
  } else if (position >= 1) {
    return right;
  }
  switch (space) {
    case ColorInterpolationSpace.HSL:
      return hslToRGB(interpolateHSL(position, rgbToHSL(left), rgbToHSL(right)));
    case ColorInterpolationSpace.HSV:
      return hsvToRGB(interpolateHSV(position, rgbToHSV(left), rgbToHSV(right)));
    case ColorInterpolationSpace.XYZ:
      return xyzToRGB(interpolateXYZ(position, rgbToXYZ(left), rgbToXYZ(right)));
    case ColorInterpolationSpace.LAB:
      return labToRGB(interpolateLAB(position, rgbToLAB(left), rgbToLAB(right)));
    case ColorInterpolationSpace.LCH:
      return lchToRGB(interpolateLCH(position, rgbToLCH(left), rgbToLCH(right)));
    default:
      return interpolateRGB(position, left, right);
  }
}

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-scale.js
var ColorScale = class _ColorScale {
  constructor(stops) {
    if (stops == null || stops.length === 0) {
      throw new Error("The stops argument must be non-empty");
    } else {
      this.stops = this.sortColorScaleStops(stops);
    }
  }
  static createBalancedColorScale(colors) {
    if (colors == null || colors.length === 0) {
      throw new Error("The colors argument must be non-empty");
    }
    const stops = new Array(colors.length);
    for (let i = 0; i < colors.length; i++) {
      if (i === 0) {
        stops[i] = { color: colors[i], position: 0 };
      } else if (i === colors.length - 1) {
        stops[i] = { color: colors[i], position: 1 };
      } else {
        stops[i] = {
          color: colors[i],
          position: i * (1 / (colors.length - 1))
        };
      }
    }
    return new _ColorScale(stops);
  }
  getColor(position, interpolationMode = ColorInterpolationSpace.RGB) {
    if (this.stops.length === 1) {
      return this.stops[0].color;
    } else if (position <= 0) {
      return this.stops[0].color;
    } else if (position >= 1) {
      return this.stops[this.stops.length - 1].color;
    }
    let lowerIndex = 0;
    for (let i = 0; i < this.stops.length; i++) {
      if (this.stops[i].position <= position) {
        lowerIndex = i;
      }
    }
    let upperIndex = lowerIndex + 1;
    if (upperIndex >= this.stops.length) {
      upperIndex = this.stops.length - 1;
    }
    const scalePosition = (position - this.stops[lowerIndex].position) * (1 / (this.stops[upperIndex].position - this.stops[lowerIndex].position));
    return interpolateByColorSpace(scalePosition, interpolationMode, this.stops[lowerIndex].color, this.stops[upperIndex].color);
  }
  trim(lowerBound, upperBound, interpolationMode = ColorInterpolationSpace.RGB) {
    if (lowerBound < 0 || upperBound > 1 || upperBound < lowerBound) {
      throw new Error("Invalid bounds");
    }
    if (lowerBound === upperBound) {
      return new _ColorScale([
        { color: this.getColor(lowerBound, interpolationMode), position: 0 }
      ]);
    }
    const containedStops = [];
    for (let i = 0; i < this.stops.length; i++) {
      if (this.stops[i].position >= lowerBound && this.stops[i].position <= upperBound) {
        containedStops.push(this.stops[i]);
      }
    }
    if (containedStops.length === 0) {
      return new _ColorScale([
        { color: this.getColor(lowerBound), position: lowerBound },
        { color: this.getColor(upperBound), position: upperBound }
      ]);
    }
    if (containedStops[0].position !== lowerBound) {
      containedStops.unshift({
        color: this.getColor(lowerBound),
        position: lowerBound
      });
    }
    if (containedStops[containedStops.length - 1].position !== upperBound) {
      containedStops.push({
        color: this.getColor(upperBound),
        position: upperBound
      });
    }
    const range2 = upperBound - lowerBound;
    const finalStops = new Array(containedStops.length);
    for (let i = 0; i < containedStops.length; i++) {
      finalStops[i] = {
        color: containedStops[i].color,
        position: (containedStops[i].position - lowerBound) / range2
      };
    }
    return new _ColorScale(finalStops);
  }
  findNextColor(position, contrast2, searchDown = false, interpolationMode = ColorInterpolationSpace.RGB, contrastErrorMargin = 5e-3, maxSearchIterations = 32) {
    if (isNaN(position) || position <= 0) {
      position = 0;
    } else if (position >= 1) {
      position = 1;
    }
    const startingColor = this.getColor(position, interpolationMode);
    const finalPosition = searchDown ? 0 : 1;
    const finalColor = this.getColor(finalPosition, interpolationMode);
    const finalContrast = contrastRatio(startingColor, finalColor);
    if (finalContrast <= contrast2) {
      return finalPosition;
    }
    let testRangeMin = searchDown ? 0 : position;
    let testRangeMax = searchDown ? position : 0;
    let mid = finalPosition;
    let iterations = 0;
    while (iterations <= maxSearchIterations) {
      mid = Math.abs(testRangeMax - testRangeMin) / 2 + testRangeMin;
      const midColor = this.getColor(mid, interpolationMode);
      const midContrast = contrastRatio(startingColor, midColor);
      if (Math.abs(midContrast - contrast2) <= contrastErrorMargin) {
        return mid;
      } else if (midContrast > contrast2) {
        if (searchDown) {
          testRangeMin = mid;
        } else {
          testRangeMax = mid;
        }
      } else {
        if (searchDown) {
          testRangeMax = mid;
        } else {
          testRangeMin = mid;
        }
      }
      iterations++;
    }
    return mid;
  }
  clone() {
    const newStops = new Array(this.stops.length);
    for (let i = 0; i < newStops.length; i++) {
      newStops[i] = {
        color: this.stops[i].color,
        position: this.stops[i].position
      };
    }
    return new _ColorScale(newStops);
  }
  sortColorScaleStops(stops) {
    return stops.sort((a, b) => {
      const A = a.position;
      const B = b.position;
      if (A < B) {
        return -1;
      } else if (A > B) {
        return 1;
      } else {
        return 0;
      }
    });
  }
};

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/parse-color.js
var hexRGBRegex = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
function parseColorHexRGB(raw) {
  const result = hexRGBRegex.exec(raw);
  if (result === null) {
    return null;
  }
  let digits = result[1];
  if (digits.length === 3) {
    const r = digits.charAt(0);
    const g = digits.charAt(1);
    const b = digits.charAt(2);
    digits = r.concat(r, g, g, b, b);
  }
  const rawInt = parseInt(digits, 16);
  if (isNaN(rawInt)) {
    return null;
  }
  return new ColorRGBA64(normalize((rawInt & 16711680) >>> 16, 0, 255), normalize((rawInt & 65280) >>> 8, 0, 255), normalize(rawInt & 255, 0, 255), 1);
}

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/color-palette.js
var ColorPalette = class _ColorPalette {
  constructor(config) {
    this.config = Object.assign({}, _ColorPalette.defaultPaletteConfig, config);
    this.palette = [];
    this.updatePaletteColors();
  }
  updatePaletteGenerationValues(newConfig) {
    let changed = false;
    for (const key in newConfig) {
      if (this.config[key]) {
        if (this.config[key].equalValue) {
          if (!this.config[key].equalValue(newConfig[key])) {
            this.config[key] = newConfig[key];
            changed = true;
          }
        } else {
          if (newConfig[key] !== this.config[key]) {
            this.config[key] = newConfig[key];
            changed = true;
          }
        }
      }
    }
    if (changed) {
      this.updatePaletteColors();
    }
    return changed;
  }
  updatePaletteColors() {
    const scale = this.generatePaletteColorScale();
    for (let i = 0; i < this.config.steps; i++) {
      this.palette[i] = scale.getColor(i / (this.config.steps - 1), this.config.interpolationMode);
    }
  }
  generatePaletteColorScale() {
    const baseColorHSL = rgbToHSL(this.config.baseColor);
    const baseScale = new ColorScale([
      { position: 0, color: this.config.scaleColorLight },
      { position: 0.5, color: this.config.baseColor },
      { position: 1, color: this.config.scaleColorDark }
    ]);
    const trimmedScale = baseScale.trim(this.config.clipLight, 1 - this.config.clipDark);
    const trimmedLight = trimmedScale.getColor(0);
    const trimmedDark = trimmedScale.getColor(1);
    let adjustedLight = trimmedLight;
    let adjustedDark = trimmedDark;
    if (baseColorHSL.s >= this.config.saturationAdjustmentCutoff) {
      adjustedLight = saturateViaLCH(adjustedLight, this.config.saturationLight);
      adjustedDark = saturateViaLCH(adjustedDark, this.config.saturationDark);
    }
    if (this.config.multiplyLight !== 0) {
      const multiply = blendMultiply(this.config.baseColor, adjustedLight);
      adjustedLight = interpolateByColorSpace(this.config.multiplyLight, this.config.interpolationMode, adjustedLight, multiply);
    }
    if (this.config.multiplyDark !== 0) {
      const multiply = blendMultiply(this.config.baseColor, adjustedDark);
      adjustedDark = interpolateByColorSpace(this.config.multiplyDark, this.config.interpolationMode, adjustedDark, multiply);
    }
    if (this.config.overlayLight !== 0) {
      const overlay = blendOverlay(this.config.baseColor, adjustedLight);
      adjustedLight = interpolateByColorSpace(this.config.overlayLight, this.config.interpolationMode, adjustedLight, overlay);
    }
    if (this.config.overlayDark !== 0) {
      const overlay = blendOverlay(this.config.baseColor, adjustedDark);
      adjustedDark = interpolateByColorSpace(this.config.overlayDark, this.config.interpolationMode, adjustedDark, overlay);
    }
    if (this.config.baseScalePosition) {
      if (this.config.baseScalePosition <= 0) {
        return new ColorScale([
          { position: 0, color: this.config.baseColor },
          { position: 1, color: adjustedDark.clamp() }
        ]);
      } else if (this.config.baseScalePosition >= 1) {
        return new ColorScale([
          { position: 0, color: adjustedLight.clamp() },
          { position: 1, color: this.config.baseColor }
        ]);
      }
      return new ColorScale([
        { position: 0, color: adjustedLight.clamp() },
        {
          position: this.config.baseScalePosition,
          color: this.config.baseColor
        },
        { position: 1, color: adjustedDark.clamp() }
      ]);
    }
    return new ColorScale([
      { position: 0, color: adjustedLight.clamp() },
      { position: 0.5, color: this.config.baseColor },
      { position: 1, color: adjustedDark.clamp() }
    ]);
  }
};
ColorPalette.defaultPaletteConfig = {
  baseColor: parseColorHexRGB("#808080"),
  steps: 11,
  interpolationMode: ColorInterpolationSpace.RGB,
  scaleColorLight: new ColorRGBA64(1, 1, 1, 1),
  scaleColorDark: new ColorRGBA64(0, 0, 0, 1),
  clipLight: 0.185,
  clipDark: 0.16,
  saturationAdjustmentCutoff: 0.05,
  saturationLight: 0.35,
  saturationDark: 1.25,
  overlayLight: 0,
  overlayDark: 0.25,
  multiplyLight: 0,
  multiplyDark: 0,
  baseScalePosition: 0.5
};
ColorPalette.greyscalePaletteConfig = {
  baseColor: parseColorHexRGB("#808080"),
  steps: 11,
  interpolationMode: ColorInterpolationSpace.RGB,
  scaleColorLight: new ColorRGBA64(1, 1, 1, 1),
  scaleColorDark: new ColorRGBA64(0, 0, 0, 1),
  clipLight: 0,
  clipDark: 0,
  saturationAdjustmentCutoff: 0,
  saturationLight: 0,
  saturationDark: 0,
  overlayLight: 0,
  overlayDark: 0,
  multiplyLight: 0,
  multiplyDark: 0,
  baseScalePosition: 0.5
};
var defaultCenteredRescaleConfig = {
  targetSize: 63,
  spacing: 4,
  scaleColorLight: ColorPalette.defaultPaletteConfig.scaleColorLight,
  scaleColorDark: ColorPalette.defaultPaletteConfig.scaleColorDark
};

// ../web-component-sdk/node_modules/@microsoft/fast-colors/dist/component-state-color-palette.js
var ComponentStateColorPalette = class _ComponentStateColorPalette {
  constructor(config) {
    this.palette = [];
    this.config = Object.assign({}, _ComponentStateColorPalette.defaultPaletteConfig, config);
    this.regenPalettes();
  }
  regenPalettes() {
    let steps = this.config.steps;
    if (isNaN(steps) || steps < 3) {
      steps = 3;
    }
    const darkLum = 0.14;
    const darkestLum = 0.06;
    const darkLumColor = new ColorRGBA64(darkLum, darkLum, darkLum, 1);
    const stepsForLuminanceRamp = 94;
    const r = new ColorPalette(Object.assign(Object.assign({}, ColorPalette.greyscalePaletteConfig), { baseColor: darkLumColor, baseScalePosition: (1 - darkLum) * 100 / stepsForLuminanceRamp, steps }));
    const referencePalette = r.palette;
    const baseColorLum1 = rgbToLinearLuminance(this.config.baseColor);
    const baseColorLum2 = rgbToHSL(this.config.baseColor).l;
    const baseColorLum = (baseColorLum1 + baseColorLum2) / 2;
    const baseColorRefIndex = this.matchRelativeLuminanceIndex(baseColorLum, referencePalette);
    const baseColorPercent = baseColorRefIndex / (steps - 1);
    const darkRefIndex = this.matchRelativeLuminanceIndex(darkLum, referencePalette);
    const darkPercent = darkRefIndex / (steps - 1);
    const baseColorHSL = rgbToHSL(this.config.baseColor);
    const darkBaseColor = hslToRGB(ColorHSL.fromObject({
      h: baseColorHSL.h,
      s: baseColorHSL.s,
      l: darkLum
    }));
    const darkestBaseColor = hslToRGB(ColorHSL.fromObject({
      h: baseColorHSL.h,
      s: baseColorHSL.s,
      l: darkestLum
    }));
    const fullColorScaleStops = new Array(5);
    fullColorScaleStops[0] = {
      position: 0,
      color: new ColorRGBA64(1, 1, 1, 1)
    };
    fullColorScaleStops[1] = {
      position: baseColorPercent,
      color: this.config.baseColor
    };
    fullColorScaleStops[2] = {
      position: darkPercent,
      color: darkBaseColor
    };
    fullColorScaleStops[3] = {
      position: 0.99,
      color: darkestBaseColor
    };
    fullColorScaleStops[4] = {
      position: 1,
      color: new ColorRGBA64(0, 0, 0, 1)
    };
    const scale = new ColorScale(fullColorScaleStops);
    this.palette = new Array(steps);
    for (let i = 0; i < steps; i++) {
      const c = scale.getColor(i / (steps - 1), ColorInterpolationSpace.RGB);
      this.palette[i] = c;
    }
  }
  matchRelativeLuminanceIndex(input, reference) {
    let bestFitValue = Number.MAX_VALUE;
    let bestFitIndex = 0;
    let i = 0;
    const referenceLength = reference.length;
    for (; i < referenceLength; i++) {
      const fitValue = Math.abs(rgbToLinearLuminance(reference[i]) - input);
      if (fitValue < bestFitValue) {
        bestFitValue = fitValue;
        bestFitIndex = i;
      }
    }
    return bestFitIndex;
  }
};
ComponentStateColorPalette.defaultPaletteConfig = {
  baseColor: parseColorHexRGB("#808080"),
  steps: 94
};

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/utilities/relative-luminance.js
function contrast(a, b) {
  const L1 = a.relativeLuminance > b.relativeLuminance ? a : b;
  const L2 = a.relativeLuminance > b.relativeLuminance ? b : a;
  return (L1.relativeLuminance + 0.05) / (L2.relativeLuminance + 0.05);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/swatch.js
var SwatchRGB = Object.freeze({
  create(r, g, b) {
    return new SwatchRGBImpl(r, g, b);
  },
  from(obj) {
    return new SwatchRGBImpl(obj.r, obj.g, obj.b);
  }
});
function isSwatchRGB(value) {
  const test = {
    r: 0,
    g: 0,
    b: 0,
    toColorString: () => "",
    contrast: () => 0,
    relativeLuminance: 0
  };
  for (const key in test) {
    if (typeof test[key] !== typeof value[key]) {
      return false;
    }
  }
  return true;
}
var SwatchRGBImpl = class _SwatchRGBImpl extends ColorRGBA64 {
  /**
   *
   * @param red - Red channel expressed as a number between 0 and 1
   * @param green - Green channel expressed as a number between 0 and 1
   * @param blue - Blue channel expressed as a number between 0 and 1
   */
  constructor(red, green, blue) {
    super(red, green, blue, 1);
    this.toColorString = this.toStringHexRGB;
    this.contrast = contrast.bind(null, this);
    this.createCSS = this.toColorString;
    this.relativeLuminance = rgbToRelativeLuminance(this);
  }
  static fromObject(obj) {
    return new _SwatchRGBImpl(obj.r, obj.g, obj.b);
  }
};

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/utilities/binary-search.js
function binarySearch(valuesToSearch, searchCondition, startIndex = 0, endIndex = valuesToSearch.length - 1) {
  if (endIndex === startIndex) {
    return valuesToSearch[startIndex];
  }
  const middleIndex = Math.floor((endIndex - startIndex) / 2) + startIndex;
  return searchCondition(valuesToSearch[middleIndex]) ? binarySearch(valuesToSearch, searchCondition, startIndex, middleIndex) : binarySearch(
    valuesToSearch,
    searchCondition,
    middleIndex + 1,
    // exclude this index because it failed the search condition
    endIndex
  );
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/utilities/is-dark.js
var target = (-0.1 + Math.sqrt(0.21)) / 2;
function isDark(color) {
  return color.relativeLuminance <= target;
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/utilities/direction-by-is-dark.js
function directionByIsDark(color) {
  return isDark(color) ? -1 : 1;
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/palette.js
var defaultPaletteRGBOptions = {
  stepContrast: 1.03,
  stepContrastRamp: 0.03,
  preserveSource: false
};
function create2(rOrSource, g, b) {
  if (typeof rOrSource === "number") {
    return PaletteRGB.from(SwatchRGB.create(rOrSource, g, b));
  } else {
    return PaletteRGB.from(rOrSource);
  }
}
function from(source, options) {
  return isSwatchRGB(source) ? PaletteRGBImpl.from(source, options) : PaletteRGBImpl.from(SwatchRGB.create(source.r, source.g, source.b), options);
}
var PaletteRGB = Object.freeze({
  create: create2,
  from
});
var PaletteRGBImpl = class _PaletteRGBImpl {
  /**
   *
   * @param source - The source color for the palette
   * @param swatches - All swatches in the palette
   */
  constructor(source, swatches) {
    this.closestIndexCache = /* @__PURE__ */ new Map();
    this.source = source;
    this.swatches = swatches;
    this.reversedSwatches = Object.freeze([...this.swatches].reverse());
    this.lastIndex = this.swatches.length - 1;
  }
  /**
   * {@inheritdoc Palette.colorContrast}
   */
  colorContrast(reference, contrastTarget, initialSearchIndex, direction2) {
    if (initialSearchIndex === void 0) {
      initialSearchIndex = this.closestIndexOf(reference);
    }
    let source = this.swatches;
    const endSearchIndex = this.lastIndex;
    let startSearchIndex = initialSearchIndex;
    if (direction2 === void 0) {
      direction2 = directionByIsDark(reference);
    }
    const condition = (value) => contrast(reference, value) >= contrastTarget;
    if (direction2 === -1) {
      source = this.reversedSwatches;
      startSearchIndex = endSearchIndex - startSearchIndex;
    }
    return binarySearch(source, condition, startSearchIndex, endSearchIndex);
  }
  /**
   * {@inheritdoc Palette.get}
   */
  get(index) {
    return this.swatches[index] || this.swatches[clamp(index, 0, this.lastIndex)];
  }
  /**
   * {@inheritdoc Palette.closestIndexOf}
   */
  closestIndexOf(reference) {
    if (this.closestIndexCache.has(reference.relativeLuminance)) {
      return this.closestIndexCache.get(reference.relativeLuminance);
    }
    let index = this.swatches.indexOf(reference);
    if (index !== -1) {
      this.closestIndexCache.set(reference.relativeLuminance, index);
      return index;
    }
    const closest = this.swatches.reduce((previous, next) => Math.abs(next.relativeLuminance - reference.relativeLuminance) < Math.abs(previous.relativeLuminance - reference.relativeLuminance) ? next : previous);
    index = this.swatches.indexOf(closest);
    this.closestIndexCache.set(reference.relativeLuminance, index);
    return index;
  }
  /**
   * Bump the saturation if it falls below the reference color saturation.
   * @param reference Color with target saturation
   * @param color Color to check and bump if below target saturation
   * @returns Original or adjusted color
   */
  static saturationBump(reference, color) {
    const hslReference = rgbToHSL(reference);
    const saturationTarget = hslReference.s;
    const hslColor = rgbToHSL(color);
    if (hslColor.s < saturationTarget) {
      const hslNew = new ColorHSL(hslColor.h, saturationTarget, hslColor.l);
      return hslToRGB(hslNew);
    }
    return color;
  }
  /**
   * Scales input from 0 to 100 to 0 to 0.5.
   * @param l Input number, 0 to 100
   * @returns Output number, 0 to 0.5
   */
  static ramp(l) {
    const inputval = l / 100;
    if (inputval > 0.5)
      return (inputval - 0.5) / 0.5;
    return 2 * inputval;
  }
  /**
   * Create a palette following the desired curve and many steps to build a smaller palette from.
   * @param source The source swatch to create a palette from
   * @returns The palette
   */
  static createHighResolutionPalette(source) {
    const swatches = [];
    const labSource = rgbToLAB(ColorRGBA64.fromObject(source).roundToPrecision(4));
    const lab0 = labToRGB(new ColorLAB(0, labSource.a, labSource.b)).clamp().roundToPrecision(4);
    const lab50 = labToRGB(new ColorLAB(50, labSource.a, labSource.b)).clamp().roundToPrecision(4);
    const lab100 = labToRGB(new ColorLAB(100, labSource.a, labSource.b)).clamp().roundToPrecision(4);
    const rgbMin = new ColorRGBA64(0, 0, 0);
    const rgbMax = new ColorRGBA64(1, 1, 1);
    const lAbove = lab100.equalValue(rgbMax) ? 0 : 14;
    const lBelow = lab0.equalValue(rgbMin) ? 0 : 14;
    for (let l = 100 + lAbove; l >= 0 - lBelow; l -= 0.5) {
      let rgb;
      if (l < 0) {
        const percentFromRgbMinToLab0 = l / lBelow + 1;
        rgb = interpolateRGB(percentFromRgbMinToLab0, rgbMin, lab0);
      } else if (l <= 50) {
        rgb = interpolateRGB(_PaletteRGBImpl.ramp(l), lab0, lab50);
      } else if (l <= 100) {
        rgb = interpolateRGB(_PaletteRGBImpl.ramp(l), lab50, lab100);
      } else {
        const percentFromLab100ToRgbMax = (l - 100) / lAbove;
        rgb = interpolateRGB(percentFromLab100ToRgbMax, lab100, rgbMax);
      }
      rgb = _PaletteRGBImpl.saturationBump(lab50, rgb).roundToPrecision(4);
      swatches.push(SwatchRGB.from(rgb));
    }
    return new _PaletteRGBImpl(source, swatches);
  }
  /**
   * Adjust one end of the contrast-based palette so it doesn't abruptly fall to black (or white).
   * @param swatchContrast Function to get the target contrast for the next swatch
   * @param referencePalette The high resolution palette
   * @param targetPalette The contrast-based palette to adjust
   * @param direction The end to adjust
   */
  static adjustEnd(swatchContrast, referencePalette, targetPalette, direction2) {
    const refSwatches = direction2 === -1 ? referencePalette.swatches : referencePalette.reversedSwatches;
    const refIndex = (swatch) => {
      const index = referencePalette.closestIndexOf(swatch);
      return direction2 === 1 ? referencePalette.lastIndex - index : index;
    };
    if (direction2 === 1) {
      targetPalette.reverse();
    }
    const targetContrast = swatchContrast(targetPalette[targetPalette.length - 2]);
    const actualContrast = roundToPrecisionSmall(contrast(targetPalette[targetPalette.length - 1], targetPalette[targetPalette.length - 2]), 2);
    if (actualContrast < targetContrast) {
      targetPalette.pop();
      const safeSecondSwatch = referencePalette.colorContrast(refSwatches[referencePalette.lastIndex], targetContrast, void 0, direction2);
      const safeSecondRefIndex = refIndex(safeSecondSwatch);
      const targetSwatchCurrentRefIndex = refIndex(targetPalette[targetPalette.length - 2]);
      const swatchesToSpace = safeSecondRefIndex - targetSwatchCurrentRefIndex;
      let space = 1;
      for (let i = targetPalette.length - swatchesToSpace - 1; i < targetPalette.length; i++) {
        const currentRefIndex = refIndex(targetPalette[i]);
        const nextRefIndex = i === targetPalette.length - 1 ? referencePalette.lastIndex : currentRefIndex + space;
        targetPalette[i] = refSwatches[nextRefIndex];
        space++;
      }
    }
    if (direction2 === 1) {
      targetPalette.reverse();
    }
  }
  /**
   * Generate a palette with consistent minimum contrast between swatches.
   * @param source The source color
   * @param options Palette generation options
   * @returns A palette meeting the requested contrast between swatches.
   */
  static createColorPaletteByContrast(source, options) {
    const referencePalette = _PaletteRGBImpl.createHighResolutionPalette(source);
    const nextContrast = (swatch) => {
      const c = options.stepContrast + options.stepContrast * (1 - swatch.relativeLuminance) * options.stepContrastRamp;
      return roundToPrecisionSmall(c, 2);
    };
    const swatches = [];
    let ref2 = options.preserveSource ? source : referencePalette.swatches[0];
    swatches.push(ref2);
    do {
      const targetContrast = nextContrast(ref2);
      ref2 = referencePalette.colorContrast(ref2, targetContrast, void 0, 1);
      swatches.push(ref2);
    } while (ref2.relativeLuminance > 0);
    if (options.preserveSource) {
      ref2 = source;
      do {
        const targetContrast = nextContrast(ref2);
        ref2 = referencePalette.colorContrast(ref2, targetContrast, void 0, -1);
        swatches.unshift(ref2);
      } while (ref2.relativeLuminance < 1);
    }
    this.adjustEnd(nextContrast, referencePalette, swatches, -1);
    if (options.preserveSource) {
      this.adjustEnd(nextContrast, referencePalette, swatches, 1);
    }
    return swatches;
  }
  /**
   * Create a color palette from a provided swatch
   * @param source - The source swatch to create a palette from
   * @returns
   */
  static from(source, options) {
    const opts = options === void 0 || null ? defaultPaletteRGBOptions : Object.assign(Object.assign({}, defaultPaletteRGBOptions), options);
    return new _PaletteRGBImpl(source, Object.freeze(_PaletteRGBImpl.createColorPaletteByContrast(source, opts)));
  }
};

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/utilities/color-constants.js
var white = SwatchRGB.create(1, 1, 1);
var black = SwatchRGB.create(0, 0, 0);
var middleGrey = SwatchRGB.create(0.5, 0.5, 0.5);
var base = parseColorHexRGB("#0078D4");
var accentBase = SwatchRGB.create(base.r, base.g, base.b);

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/foreground-on-accent.js
function foregroundOnAccentSet(restFill, hoverFill, activeFill, focusFill, contrastTarget) {
  const defaultRule = (fill) => fill.contrast(white) >= contrastTarget ? white : black;
  const restForeground = defaultRule(restFill);
  const hoverForeground = defaultRule(hoverFill);
  const activeForeground = restForeground.relativeLuminance === hoverForeground.relativeLuminance ? restForeground : defaultRule(activeFill);
  const focusForeground = defaultRule(focusFill);
  return {
    rest: restForeground,
    hover: hoverForeground,
    active: activeForeground,
    focus: focusForeground
  };
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/gradient-swatch.js
var GradientSwatchRGB = class _GradientSwatchRGB {
  /**
   *
   * @param red Red channel expressed as a number between 0 and 1
   * @param green Green channel expressed as a number between 0 and 1
   * @param blue Blue channel expressed as a number between 0 and 1
   */
  constructor(red, green, blue, cssGradient) {
    this.toColorString = () => this.cssGradient;
    this.contrast = contrast.bind(null, this);
    this.createCSS = this.toColorString;
    this.color = new ColorRGBA64(red, green, blue);
    this.cssGradient = cssGradient;
    this.relativeLuminance = rgbToRelativeLuminance(this.color);
    this.r = red;
    this.g = green;
    this.b = blue;
  }
  /**
   * Creates a GradientSwatch from a base color and gradient definition
   * @param obj The base color object, used for relative luminance
   * @param cssGradient The actual gradient to be rendered
   * @returns New GradientSwatch object
   */
  static fromObject(obj, cssGradient) {
    return new _GradientSwatchRGB(obj.r, obj.g, obj.b, cssGradient);
  }
};

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/gradient-shadow-stroke.js
var black2 = new ColorRGBA64(0, 0, 0);
var white2 = new ColorRGBA64(1, 1, 1);
function gradientShadowStroke(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta, shadowDelta, direction2, shadowPercentage = 10, blendWithReference = false) {
  const referenceIndex = palette.closestIndexOf(reference);
  if (direction2 === void 0) {
    direction2 = directionByIsDark(reference);
  }
  function overlayHelper(color) {
    if (blendWithReference) {
      const refIndex = palette.closestIndexOf(reference);
      const refSwatch = palette.get(refIndex);
      const overlaySolid = color.relativeLuminance < reference.relativeLuminance ? black2 : white2;
      const overlayColor = calculateOverlayColor(parseColorHexRGB(color.toColorString()), parseColorHexRGB(refSwatch.toColorString()), overlaySolid).roundToPrecision(2);
      const blend = computeAlphaBlend(parseColorHexRGB(reference.toColorString()), overlayColor);
      return SwatchRGB.from(blend);
    } else {
      return color;
    }
  }
  const restIndex = referenceIndex + direction2 * restDelta;
  const hoverIndex = restIndex + direction2 * (hoverDelta - restDelta);
  const activeIndex = restIndex + direction2 * (activeDelta - restDelta);
  const focusIndex = restIndex + direction2 * (focusDelta - restDelta);
  const startPosition = direction2 === -1 ? 0 : 100 - shadowPercentage;
  const endPosition = direction2 === -1 ? shadowPercentage : 100;
  function gradientHelper(index, applyShadow) {
    const color = palette.get(index);
    if (applyShadow) {
      const shadowColor = palette.get(index + direction2 * shadowDelta);
      const startColor = direction2 === -1 ? shadowColor : color;
      const endColor = direction2 === -1 ? color : shadowColor;
      const g = `linear-gradient(${overlayHelper(startColor).toColorString()} ${startPosition}%, ${overlayHelper(endColor).toColorString()} ${endPosition}%)`;
      return GradientSwatchRGB.fromObject(startColor, g);
    } else {
      return overlayHelper(color);
    }
  }
  return {
    rest: gradientHelper(restIndex, true),
    hover: gradientHelper(hoverIndex, true),
    active: gradientHelper(activeIndex, false),
    focus: gradientHelper(focusIndex, true)
  };
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/underline-stroke.js
function underlineStroke(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta, shadowDelta, width) {
  const referenceIndex = palette.closestIndexOf(reference);
  const direction2 = directionByIsDark(reference);
  const restIndex = referenceIndex + direction2 * restDelta;
  const hoverIndex = restIndex + direction2 * (hoverDelta - restDelta);
  const activeIndex = restIndex + direction2 * (activeDelta - restDelta);
  const focusIndex = restIndex + direction2 * (focusDelta - restDelta);
  const midPosition = `calc(100% - ${width})`;
  function gradientHelper(index, applyShadow) {
    const color = palette.get(index);
    if (applyShadow) {
      const underlineColor = palette.get(index + direction2 * shadowDelta);
      const g = `linear-gradient(${color.toColorString()} ${midPosition}, ${underlineColor.toColorString()} ${midPosition}, ${underlineColor.toColorString()})`;
      return GradientSwatchRGB.fromObject(color, g);
    } else {
      return color;
    }
  }
  return {
    rest: gradientHelper(restIndex, true),
    hover: gradientHelper(hoverIndex, true),
    active: gradientHelper(activeIndex, false),
    focus: gradientHelper(focusIndex, true)
  };
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/contrast-swatch.js
function contrastSwatch(palette, reference, contrast2) {
  return palette.colorContrast(reference, contrast2);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/contrast-and-delta-swatch-set.js
function contrastAndDeltaSwatchSet(palette, reference, baseContrast, restDelta, hoverDelta, activeDelta, focusDelta, direction2) {
  if (direction2 === null || direction2 === void 0) {
    direction2 = directionByIsDark(reference);
  }
  const baseIndex = palette.closestIndexOf(palette.colorContrast(reference, baseContrast));
  return {
    rest: palette.get(baseIndex + direction2 * restDelta),
    hover: palette.get(baseIndex + direction2 * hoverDelta),
    active: palette.get(baseIndex + direction2 * activeDelta),
    focus: palette.get(baseIndex + direction2 * focusDelta)
  };
}
function contrastAndDeltaSwatchSetByLuminance(palette, reference, lightBaseContrast, lightRestDelta, lightHoverDelta, lightActiveDelta, lightFocusDelta, lightDirection = void 0, darkBaseContrast, darkRestDelta, darkHoverDelta, darkActiveDelta, darkFocusDelta, darkDirection = void 0) {
  if (isDark(reference)) {
    return contrastAndDeltaSwatchSet(palette, reference, darkBaseContrast, darkRestDelta, darkHoverDelta, darkActiveDelta, darkFocusDelta, darkDirection);
  } else {
    return contrastAndDeltaSwatchSet(palette, reference, lightBaseContrast, lightRestDelta, lightHoverDelta, lightActiveDelta, lightFocusDelta, lightDirection);
  }
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/delta-swatch.js
function deltaSwatch(palette, reference, delta) {
  return palette.get(palette.closestIndexOf(reference) + directionByIsDark(reference) * delta);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/delta-swatch-set.js
function deltaSwatchSet(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta, direction2) {
  const referenceIndex = palette.closestIndexOf(reference);
  if (direction2 === null || direction2 === void 0) {
    direction2 = directionByIsDark(reference);
  }
  return {
    rest: palette.get(referenceIndex + direction2 * restDelta),
    hover: palette.get(referenceIndex + direction2 * hoverDelta),
    active: palette.get(referenceIndex + direction2 * activeDelta),
    focus: palette.get(referenceIndex + direction2 * focusDelta)
  };
}
function deltaSwatchSetByLuminance(palette, reference, lightRestDelta, lightHoverDelta, lightActiveDelta, lightFocusDelta, lightDirection = void 0, darkRestDelta, darkHoverDelta, darkActiveDelta, darkFocusDelta, darkDirection = void 0) {
  if (isDark(reference)) {
    return deltaSwatchSet(palette, reference, darkRestDelta, darkHoverDelta, darkActiveDelta, darkFocusDelta, darkDirection);
  } else {
    return deltaSwatchSet(palette, reference, lightRestDelta, lightHoverDelta, lightActiveDelta, lightFocusDelta, lightDirection);
  }
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/focus-stroke.js
function focusStrokeOuter(palette, reference) {
  return isDark(reference) ? white : black;
}
function focusStrokeInner(palette, reference, focusColor) {
  return isDark(reference) ? black : white;
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/utilities/base-layer-luminance.js
function baseLayerLuminanceSwatch(luminance) {
  return SwatchRGB.create(luminance, luminance, luminance);
}
var StandardLuminance;
(function(StandardLuminance2) {
  StandardLuminance2[StandardLuminance2["LightMode"] = 0.98] = "LightMode";
  StandardLuminance2[StandardLuminance2["DarkMode"] = 0.15] = "DarkMode";
})(StandardLuminance || (StandardLuminance = {}));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/neutral-layer-1.js
function neutralLayer1Index(palette, baseLayerLuminance2) {
  return palette.closestIndexOf(baseLayerLuminanceSwatch(baseLayerLuminance2));
}
function neutralLayer1(palette, baseLayerLuminance2) {
  return palette.get(neutralLayer1Index(palette, baseLayerLuminance2));
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/neutral-layer-floating.js
function neutralLayerFloating(palette, baseLayerLuminance2, layerDelta) {
  return palette.get(neutralLayer1Index(palette, baseLayerLuminance2) + layerDelta);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/neutral-layer-2.js
function neutralLayer2(palette, baseLayerLuminance2, layerDelta) {
  return palette.get(neutralLayer1Index(palette, baseLayerLuminance2) + layerDelta * -1);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/neutral-layer-3.js
function neutralLayer3(palette, baseLayerLuminance2, layerDelta) {
  return palette.get(neutralLayer1Index(palette, baseLayerLuminance2) + layerDelta * -1 * 2);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/color/recipes/neutral-layer-4.js
function neutralLayer4(palette, baseLayerLuminance2, layerDelta) {
  return palette.get(neutralLayer1Index(palette, baseLayerLuminance2) + layerDelta * -1 * 3);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/utilities/type-ramp.js
var StandardFontWeight = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Normal: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900
};

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/design-tokens.js
var { create: create3 } = DesignToken;
function createNonCss(name) {
  return DesignToken.create({ name, cssCustomPropertyName: null });
}
var direction = create3("direction").withDefault(Direction.ltr);
var disabledOpacity = create3("disabled-opacity").withDefault(0.3);
var baseHeightMultiplier = create3("base-height-multiplier").withDefault(8);
var baseHorizontalSpacingMultiplier = create3("base-horizontal-spacing-multiplier").withDefault(3);
var density = create3("density").withDefault(0);
var designUnit = create3("design-unit").withDefault(4);
var controlCornerRadius = create3("control-corner-radius").withDefault(4);
var layerCornerRadius = create3("layer-corner-radius").withDefault(8);
var strokeWidth = create3("stroke-width").withDefault(1);
var focusStrokeWidth = create3("focus-stroke-width").withDefault(2);
var bodyFont = create3("body-font").withDefault('"Segoe UI Variable", "Segoe UI", sans-serif');
var fontWeight = create3("font-weight").withDefault(StandardFontWeight.Normal);
function fontVariations(sizeToken) {
  return (element) => {
    const size = sizeToken.getValueFor(element);
    const weight = fontWeight.getValueFor(element);
    if (size.endsWith("px")) {
      const px = Number.parseFloat(size.replace("px", ""));
      if (px <= 12) {
        return `"wght" ${weight}, "opsz" 8`;
      } else if (px > 24) {
        return `"wght" ${weight}, "opsz" 36`;
      }
    }
    return `"wght" ${weight}, "opsz" 10.5`;
  };
}
var typeRampBaseFontSize = create3("type-ramp-base-font-size").withDefault("14px");
var typeRampBaseLineHeight = create3("type-ramp-base-line-height").withDefault("20px");
var typeRampBaseFontVariations = create3("type-ramp-base-font-variations").withDefault(fontVariations(typeRampBaseFontSize));
var typeRampMinus1FontSize = create3("type-ramp-minus-1-font-size").withDefault("12px");
var typeRampMinus1LineHeight = create3("type-ramp-minus-1-line-height").withDefault("16px");
var typeRampMinus1FontVariations = create3("type-ramp-minus-1-font-variations").withDefault(fontVariations(typeRampMinus1FontSize));
var typeRampMinus2FontSize = create3("type-ramp-minus-2-font-size").withDefault("10px");
var typeRampMinus2LineHeight = create3("type-ramp-minus-2-line-height").withDefault("14px");
var typeRampMinus2FontVariations = create3("type-ramp-minus-2-font-variations").withDefault(fontVariations(typeRampMinus2FontSize));
var typeRampPlus1FontSize = create3("type-ramp-plus-1-font-size").withDefault("16px");
var typeRampPlus1LineHeight = create3("type-ramp-plus-1-line-height").withDefault("22px");
var typeRampPlus1FontVariations = create3("type-ramp-plus-1-font-variations").withDefault(fontVariations(typeRampPlus1FontSize));
var typeRampPlus2FontSize = create3("type-ramp-plus-2-font-size").withDefault("20px");
var typeRampPlus2LineHeight = create3("type-ramp-plus-2-line-height").withDefault("26px");
var typeRampPlus2FontVariations = create3("type-ramp-plus-2-font-variations").withDefault(fontVariations(typeRampPlus2FontSize));
var typeRampPlus3FontSize = create3("type-ramp-plus-3-font-size").withDefault("24px");
var typeRampPlus3LineHeight = create3("type-ramp-plus-3-line-height").withDefault("32px");
var typeRampPlus3FontVariations = create3("type-ramp-plus-3-font-variations").withDefault(fontVariations(typeRampPlus3FontSize));
var typeRampPlus4FontSize = create3("type-ramp-plus-4-font-size").withDefault("28px");
var typeRampPlus4LineHeight = create3("type-ramp-plus-4-line-height").withDefault("36px");
var typeRampPlus4FontVariations = create3("type-ramp-plus-4-font-variations").withDefault(fontVariations(typeRampPlus4FontSize));
var typeRampPlus5FontSize = create3("type-ramp-plus-5-font-size").withDefault("32px");
var typeRampPlus5LineHeight = create3("type-ramp-plus-5-line-height").withDefault("40px");
var typeRampPlus5FontVariations = create3("type-ramp-plus-5-font-variations").withDefault(fontVariations(typeRampPlus5FontSize));
var typeRampPlus6FontSize = create3("type-ramp-plus-6-font-size").withDefault("40px");
var typeRampPlus6LineHeight = create3("type-ramp-plus-6-line-height").withDefault("52px");
var typeRampPlus6FontVariations = create3("type-ramp-plus-6-font-variations").withDefault(fontVariations(typeRampPlus6FontSize));
var baseLayerLuminance = create3("base-layer-luminance").withDefault(StandardLuminance.LightMode);
var accentFillRestDelta = createNonCss("accent-fill-rest-delta").withDefault(0);
var accentFillHoverDelta = createNonCss("accent-fill-hover-delta").withDefault(-2);
var accentFillActiveDelta = createNonCss("accent-fill-active-delta").withDefault(-5);
var accentFillFocusDelta = createNonCss("accent-fill-focus-delta").withDefault(0);
var accentForegroundRestDelta = createNonCss("accent-foreground-rest-delta").withDefault(0);
var accentForegroundHoverDelta = createNonCss("accent-foreground-hover-delta").withDefault(3);
var accentForegroundActiveDelta = createNonCss("accent-foreground-active-delta").withDefault(-8);
var accentForegroundFocusDelta = createNonCss("accent-foreground-focus-delta").withDefault(0);
var neutralFillRestDelta = createNonCss("neutral-fill-rest-delta").withDefault(-1);
var neutralFillHoverDelta = createNonCss("neutral-fill-hover-delta").withDefault(1);
var neutralFillActiveDelta = createNonCss("neutral-fill-active-delta").withDefault(0);
var neutralFillFocusDelta = createNonCss("neutral-fill-focus-delta").withDefault(0);
var neutralFillInputRestDelta = createNonCss("neutral-fill-input-rest-delta").withDefault(-1);
var neutralFillInputHoverDelta = createNonCss("neutral-fill-input-hover-delta").withDefault(1);
var neutralFillInputActiveDelta = createNonCss("neutral-fill-input-active-delta").withDefault(0);
var neutralFillInputFocusDelta = createNonCss("neutral-fill-input-focus-delta").withDefault(-2);
var neutralFillInputAltRestDelta = createNonCss("neutral-fill-input-alt-rest-delta").withDefault(2);
var neutralFillInputAltHoverDelta = createNonCss("neutral-fill-input-alt-hover-delta").withDefault(4);
var neutralFillInputAltActiveDelta = createNonCss("neutral-fill-input-alt-active-delta").withDefault(6);
var neutralFillInputAltFocusDelta = createNonCss("neutral-fill-input-alt-focus-delta").withDefault(2);
var neutralFillLayerRestDelta = createNonCss("neutral-fill-layer-rest-delta").withDefault(-2);
var neutralFillLayerHoverDelta = createNonCss("neutral-fill-layer-hover-delta").withDefault(-3);
var neutralFillLayerActiveDelta = createNonCss("neutral-fill-layer-active-delta").withDefault(-3);
var neutralFillLayerAltRestDelta = createNonCss("neutral-fill-layer-alt-rest-delta").withDefault(-1);
var neutralFillSecondaryRestDelta = createNonCss("neutral-fill-secondary-rest-delta").withDefault(3);
var neutralFillSecondaryHoverDelta = createNonCss("neutral-fill-secondary-hover-delta").withDefault(2);
var neutralFillSecondaryActiveDelta = createNonCss("neutral-fill-secondary-active-delta").withDefault(1);
var neutralFillSecondaryFocusDelta = createNonCss("neutral-fill-secondary-focus-delta").withDefault(3);
var neutralFillStealthRestDelta = createNonCss("neutral-fill-stealth-rest-delta").withDefault(0);
var neutralFillStealthHoverDelta = createNonCss("neutral-fill-stealth-hover-delta").withDefault(3);
var neutralFillStealthActiveDelta = createNonCss("neutral-fill-stealth-active-delta").withDefault(2);
var neutralFillStealthFocusDelta = createNonCss("neutral-fill-stealth-focus-delta").withDefault(0);
var neutralFillStrongRestDelta = createNonCss("neutral-fill-strong-rest-delta").withDefault(0);
var neutralFillStrongHoverDelta = createNonCss("neutral-fill-strong-hover-delta").withDefault(8);
var neutralFillStrongActiveDelta = createNonCss("neutral-fill-strong-active-delta").withDefault(-5);
var neutralFillStrongFocusDelta = createNonCss("neutral-fill-strong-focus-delta").withDefault(0);
var neutralStrokeRestDelta = createNonCss("neutral-stroke-rest-delta").withDefault(8);
var neutralStrokeHoverDelta = createNonCss("neutral-stroke-hover-delta").withDefault(12);
var neutralStrokeActiveDelta = createNonCss("neutral-stroke-active-delta").withDefault(6);
var neutralStrokeFocusDelta = createNonCss("neutral-stroke-focus-delta").withDefault(8);
var neutralStrokeControlRestDelta = createNonCss("neutral-stroke-control-rest-delta").withDefault(3);
var neutralStrokeControlHoverDelta = createNonCss("neutral-stroke-control-hover-delta").withDefault(5);
var neutralStrokeControlActiveDelta = createNonCss("neutral-stroke-control-active-delta").withDefault(5);
var neutralStrokeControlFocusDelta = createNonCss("neutral-stroke-control-focus-delta").withDefault(5);
var neutralStrokeDividerRestDelta = createNonCss("neutral-stroke-divider-rest-delta").withDefault(4);
var neutralStrokeLayerRestDelta = createNonCss("neutral-stroke-layer-rest-delta").withDefault(3);
var neutralStrokeLayerHoverDelta = createNonCss("neutral-stroke-layer-hover-delta").withDefault(3);
var neutralStrokeLayerActiveDelta = createNonCss("neutral-stroke-layer-active-delta").withDefault(3);
var neutralStrokeStrongHoverDelta = createNonCss("neutral-stroke-strong-hover-delta").withDefault(0);
var neutralStrokeStrongActiveDelta = createNonCss("neutral-stroke-strong-active-delta").withDefault(0);
var neutralStrokeStrongFocusDelta = createNonCss("neutral-stroke-strong-focus-delta").withDefault(0);
var neutralBaseColor = create3("neutral-base-color").withDefault(middleGrey);
var neutralPalette = createNonCss("neutral-palette").withDefault((element) => PaletteRGB.from(neutralBaseColor.getValueFor(element)));
var accentBaseColor = create3("accent-base-color").withDefault(accentBase);
var accentPalette = createNonCss("accent-palette").withDefault((element) => PaletteRGB.from(accentBaseColor.getValueFor(element)));
var neutralLayerCardContainerRecipe = createNonCss("neutral-layer-card-container-recipe").withDefault({
  evaluate: (element) => neutralLayer2(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element))
});
var neutralLayerCardContainer = create3("neutral-layer-card-container").withDefault((element) => neutralLayerCardContainerRecipe.getValueFor(element).evaluate(element));
var neutralLayerFloatingRecipe = createNonCss("neutral-layer-floating-recipe").withDefault({
  evaluate: (element) => neutralLayerFloating(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element))
});
var neutralLayerFloating2 = create3("neutral-layer-floating").withDefault((element) => neutralLayerFloatingRecipe.getValueFor(element).evaluate(element));
var neutralLayer1Recipe = createNonCss("neutral-layer-1-recipe").withDefault({
  evaluate: (element) => neutralLayer1(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element))
});
var neutralLayer12 = create3("neutral-layer-1").withDefault((element) => neutralLayer1Recipe.getValueFor(element).evaluate(element));
var neutralLayer2Recipe = createNonCss("neutral-layer-2-recipe").withDefault({
  evaluate: (element) => neutralLayer2(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element))
});
var neutralLayer22 = create3("neutral-layer-2").withDefault((element) => neutralLayer2Recipe.getValueFor(element).evaluate(element));
var neutralLayer3Recipe = createNonCss("neutral-layer-3-recipe").withDefault({
  evaluate: (element) => neutralLayer3(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element))
});
var neutralLayer32 = create3("neutral-layer-3").withDefault((element) => neutralLayer3Recipe.getValueFor(element).evaluate(element));
var neutralLayer4Recipe = createNonCss("neutral-layer-4-recipe").withDefault({
  evaluate: (element) => neutralLayer4(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element))
});
var neutralLayer42 = create3("neutral-layer-4").withDefault((element) => neutralLayer4Recipe.getValueFor(element).evaluate(element));
var fillColor = create3("fill-color").withDefault((element) => neutralLayer12.getValueFor(element));
var ContrastTarget;
(function(ContrastTarget2) {
  ContrastTarget2[ContrastTarget2["normal"] = 4.5] = "normal";
  ContrastTarget2[ContrastTarget2["large"] = 3] = "large";
})(ContrastTarget || (ContrastTarget = {}));
var accentFillRecipe = createNonCss("accent-fill-recipe").withDefault({
  evaluate: (element, reference) => contrastAndDeltaSwatchSetByLuminance(accentPalette.getValueFor(element), reference || fillColor.getValueFor(element), 5, accentFillRestDelta.getValueFor(element), accentFillHoverDelta.getValueFor(element), accentFillActiveDelta.getValueFor(element), accentFillFocusDelta.getValueFor(element), void 0, 8, accentFillRestDelta.getValueFor(element), accentFillHoverDelta.getValueFor(element), accentFillActiveDelta.getValueFor(element), accentFillFocusDelta.getValueFor(element), void 0)
});
var accentFillRest = create3("accent-fill-rest").withDefault((element) => {
  return accentFillRecipe.getValueFor(element).evaluate(element).rest;
});
var accentFillHover = create3("accent-fill-hover").withDefault((element) => {
  return accentFillRecipe.getValueFor(element).evaluate(element).hover;
});
var accentFillActive = create3("accent-fill-active").withDefault((element) => {
  return accentFillRecipe.getValueFor(element).evaluate(element).active;
});
var accentFillFocus = create3("accent-fill-focus").withDefault((element) => {
  return accentFillRecipe.getValueFor(element).evaluate(element).focus;
});
var foregroundOnAccentRecipe = createNonCss("foreground-on-accent-recipe").withDefault({
  evaluate: (element) => foregroundOnAccentSet(accentFillRest.getValueFor(element), accentFillHover.getValueFor(element), accentFillActive.getValueFor(element), accentFillFocus.getValueFor(element), ContrastTarget.normal)
});
var foregroundOnAccentRest = create3("foreground-on-accent-rest").withDefault((element) => foregroundOnAccentRecipe.getValueFor(element).evaluate(element).rest);
var foregroundOnAccentHover = create3("foreground-on-accent-hover").withDefault((element) => foregroundOnAccentRecipe.getValueFor(element).evaluate(element).hover);
var foregroundOnAccentActive = create3("foreground-on-accent-active").withDefault((element) => foregroundOnAccentRecipe.getValueFor(element).evaluate(element).active);
var foregroundOnAccentFocus = create3("foreground-on-accent-focus").withDefault((element) => foregroundOnAccentRecipe.getValueFor(element).evaluate(element).focus);
var accentForegroundRecipe = createNonCss("accent-foreground-recipe").withDefault({
  evaluate: (element, reference) => contrastAndDeltaSwatchSet(accentPalette.getValueFor(element), reference || fillColor.getValueFor(element), 9.5, accentForegroundRestDelta.getValueFor(element), accentForegroundHoverDelta.getValueFor(element), accentForegroundActiveDelta.getValueFor(element), accentForegroundFocusDelta.getValueFor(element))
});
var accentForegroundRest = create3("accent-foreground-rest").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).rest);
var accentForegroundHover = create3("accent-foreground-hover").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).hover);
var accentForegroundActive = create3("accent-foreground-active").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).active);
var accentForegroundFocus = create3("accent-foreground-focus").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).focus);
var accentStrokeControlRecipe = createNonCss("accent-stroke-control-recipe").withDefault({
  evaluate: (element, reference) => {
    return gradientShadowStroke(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), -3, -3, -3, -3, 10, 1, void 0, true);
  }
});
var accentStrokeControlRest = create3("accent-stroke-control-rest").withDefault((element) => accentStrokeControlRecipe.getValueFor(element).evaluate(element, accentFillRest.getValueFor(element)).rest);
var accentStrokeControlHover = create3("accent-stroke-control-hover").withDefault((element) => accentStrokeControlRecipe.getValueFor(element).evaluate(element, accentFillHover.getValueFor(element)).hover);
var accentStrokeControlActive = create3("accent-stroke-control-active").withDefault((element) => accentStrokeControlRecipe.getValueFor(element).evaluate(element, accentFillActive.getValueFor(element)).active);
var accentStrokeControlFocus = create3("accent-stroke-control-focus").withDefault((element) => accentStrokeControlRecipe.getValueFor(element).evaluate(element, accentFillFocus.getValueFor(element)).focus);
var neutralFillRecipe = createNonCss("neutral-fill-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatchSetByLuminance(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillRestDelta.getValueFor(element), neutralFillHoverDelta.getValueFor(element), neutralFillActiveDelta.getValueFor(element), neutralFillFocusDelta.getValueFor(element), void 0, 2, 3, 1, 2, void 0)
});
var neutralFillRest = create3("neutral-fill-rest").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillHover = create3("neutral-fill-hover").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillActive = create3("neutral-fill-active").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).active);
var neutralFillFocus = create3("neutral-fill-focus").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).focus);
var neutralFillInputRecipe = createNonCss("neutral-fill-input-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatchSetByLuminance(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillInputRestDelta.getValueFor(element), neutralFillInputHoverDelta.getValueFor(element), neutralFillInputActiveDelta.getValueFor(element), neutralFillInputFocusDelta.getValueFor(element), void 0, 2, 3, 1, 0, void 0)
});
var neutralFillInputRest = create3("neutral-fill-input-rest").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillInputHover = create3("neutral-fill-input-hover").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillInputActive = create3("neutral-fill-input-active").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).active);
var neutralFillInputFocus = create3("neutral-fill-input-focus").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).focus);
var neutralFillInputAltRecipe = createNonCss("neutral-fill-input-alt-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatchSetByLuminance(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillInputAltRestDelta.getValueFor(element), neutralFillInputAltHoverDelta.getValueFor(element), neutralFillInputAltActiveDelta.getValueFor(element), neutralFillInputAltFocusDelta.getValueFor(element), 1, neutralFillInputAltRestDelta.getValueFor(element), neutralFillInputAltRestDelta.getValueFor(element) - neutralFillInputAltHoverDelta.getValueFor(element), neutralFillInputAltRestDelta.getValueFor(element) - neutralFillInputAltActiveDelta.getValueFor(element), neutralFillInputAltFocusDelta.getValueFor(element), 1)
});
var neutralFillInputAltRest = create3("neutral-fill-input-alt-rest").withDefault((element) => neutralFillInputAltRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillInputAltHover = create3("neutral-fill-input-alt-hover").withDefault((element) => neutralFillInputAltRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillInputAltActive = create3("neutral-fill-input-alt-active").withDefault((element) => neutralFillInputAltRecipe.getValueFor(element).evaluate(element).active);
var neutralFillInputAltFocus = create3("neutral-fill-input-alt-focus").withDefault((element) => neutralFillInputAltRecipe.getValueFor(element).evaluate(element).focus);
var neutralFillLayerRecipe = createNonCss("neutral-fill-layer-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element), neutralFillLayerHoverDelta.getValueFor(element), neutralFillLayerActiveDelta.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element), 1)
});
var neutralFillLayerRest = create3("neutral-fill-layer-rest").withDefault((element) => neutralFillLayerRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillLayerHover = create3("neutral-fill-layer-hover").withDefault((element) => neutralFillLayerRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillLayerActive = create3("neutral-fill-layer-active").withDefault((element) => neutralFillLayerRecipe.getValueFor(element).evaluate(element).active);
var neutralFillLayerAltRecipe = createNonCss("neutral-fill-layer-alt-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillLayerAltRestDelta.getValueFor(element), neutralFillLayerAltRestDelta.getValueFor(element), neutralFillLayerAltRestDelta.getValueFor(element), neutralFillLayerAltRestDelta.getValueFor(element))
});
var neutralFillLayerAltRest = create3("neutral-fill-layer-alt-rest").withDefault((element) => neutralFillLayerAltRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillSecondaryRecipe = createNonCss("neutral-fill-secondary-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillSecondaryRestDelta.getValueFor(element), neutralFillSecondaryHoverDelta.getValueFor(element), neutralFillSecondaryActiveDelta.getValueFor(element), neutralFillSecondaryFocusDelta.getValueFor(element))
});
var neutralFillSecondaryRest = create3("neutral-fill-secondary-rest").withDefault((element) => neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillSecondaryHover = create3("neutral-fill-secondary-hover").withDefault((element) => neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillSecondaryActive = create3("neutral-fill-secondary-active").withDefault((element) => neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).active);
var neutralFillSecondaryFocus = create3("neutral-fill-secondary-focus").withDefault((element) => neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).focus);
var neutralFillStealthRecipe = createNonCss("neutral-fill-stealth-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillStealthRestDelta.getValueFor(element), neutralFillStealthHoverDelta.getValueFor(element), neutralFillStealthActiveDelta.getValueFor(element), neutralFillStealthFocusDelta.getValueFor(element))
});
var neutralFillStealthRest = create3("neutral-fill-stealth-rest").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillStealthHover = create3("neutral-fill-stealth-hover").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillStealthActive = create3("neutral-fill-stealth-active").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).active);
var neutralFillStealthFocus = create3("neutral-fill-stealth-focus").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).focus);
var neutralFillStrongRecipe = createNonCss("neutral-fill-strong-recipe").withDefault({
  evaluate: (element, reference) => contrastAndDeltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), 4.5, neutralFillStrongRestDelta.getValueFor(element), neutralFillStrongHoverDelta.getValueFor(element), neutralFillStrongActiveDelta.getValueFor(element), neutralFillStrongFocusDelta.getValueFor(element))
});
var neutralFillStrongRest = create3("neutral-fill-strong-rest").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillStrongHover = create3("neutral-fill-strong-hover").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillStrongActive = create3("neutral-fill-strong-active").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).active);
var neutralFillStrongFocus = create3("neutral-fill-strong-focus").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).focus);
var neutralForegroundRecipe = createNonCss("neutral-foreground-recipe").withDefault({
  evaluate: (element, reference) => contrastAndDeltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), 16, 0, -19, -30, 0)
});
var neutralForegroundRest = create3("neutral-foreground-rest").withDefault((element) => neutralForegroundRecipe.getValueFor(element).evaluate(element).rest);
var neutralForegroundHover = create3("neutral-foreground-hover").withDefault((element) => neutralForegroundRecipe.getValueFor(element).evaluate(element).hover);
var neutralForegroundActive = create3("neutral-foreground-active").withDefault((element) => neutralForegroundRecipe.getValueFor(element).evaluate(element).active);
var neutralForegroundFocus = create3("neutral-foreground-focus").withDefault((element) => neutralForegroundRecipe.getValueFor(element).evaluate(element).focus);
var neutralForegroundHintRecipe = createNonCss("neutral-foreground-hint-recipe").withDefault({
  evaluate: (element, reference) => contrastSwatch(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), 4.5)
});
var neutralForegroundHint = create3("neutral-foreground-hint").withDefault((element) => neutralForegroundHintRecipe.getValueFor(element).evaluate(element));
var neutralStrokeRecipe = createNonCss("neutral-stroke-recipe").withDefault({
  evaluate: (element, reference) => {
    return deltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralStrokeRestDelta.getValueFor(element), neutralStrokeHoverDelta.getValueFor(element), neutralStrokeActiveDelta.getValueFor(element), neutralStrokeFocusDelta.getValueFor(element));
  }
});
var neutralStrokeRest = create3("neutral-stroke-rest").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).rest);
var neutralStrokeHover = create3("neutral-stroke-hover").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).hover);
var neutralStrokeActive = create3("neutral-stroke-active").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).active);
var neutralStrokeFocus = create3("neutral-stroke-focus").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).focus);
var neutralStrokeControlRecipe = createNonCss("neutral-stroke-control-recipe").withDefault({
  evaluate: (element, reference) => {
    return gradientShadowStroke(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralStrokeControlRestDelta.getValueFor(element), neutralStrokeControlHoverDelta.getValueFor(element), neutralStrokeControlActiveDelta.getValueFor(element), neutralStrokeControlFocusDelta.getValueFor(element), 5);
  }
});
var neutralStrokeControlRest = create3("neutral-stroke-control-rest").withDefault((element) => neutralStrokeControlRecipe.getValueFor(element).evaluate(element).rest);
var neutralStrokeControlHover = create3("neutral-stroke-control-hover").withDefault((element) => neutralStrokeControlRecipe.getValueFor(element).evaluate(element).hover);
var neutralStrokeControlActive = create3("neutral-stroke-control-active").withDefault((element) => neutralStrokeControlRecipe.getValueFor(element).evaluate(element).active);
var neutralStrokeControlFocus = create3("neutral-stroke-control-focus").withDefault((element) => neutralStrokeControlRecipe.getValueFor(element).evaluate(element).focus);
var neutralStrokeDividerRecipe = createNonCss("neutral-stroke-divider-recipe").withDefault({
  evaluate: (element, reference) => deltaSwatch(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralStrokeDividerRestDelta.getValueFor(element))
});
var neutralStrokeDividerRest = create3("neutral-stroke-divider-rest").withDefault((element) => neutralStrokeDividerRecipe.getValueFor(element).evaluate(element));
var neutralStrokeInputRecipe = createNonCss("neutral-stroke-input-recipe").withDefault({
  evaluate: (element, reference) => {
    return underlineStroke(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralStrokeControlRestDelta.getValueFor(element), neutralStrokeControlHoverDelta.getValueFor(element), neutralStrokeControlActiveDelta.getValueFor(element), neutralStrokeControlFocusDelta.getValueFor(element), 20, strokeWidth.getValueFor(element) + "px");
  }
});
var neutralStrokeInputRest = create3("neutral-stroke-input-rest").withDefault((element) => neutralStrokeInputRecipe.getValueFor(element).evaluate(element).rest);
var neutralStrokeInputHover = create3("neutral-stroke-input-hover").withDefault((element) => neutralStrokeInputRecipe.getValueFor(element).evaluate(element).hover);
var neutralStrokeInputActive = create3("neutral-stroke-input-active").withDefault((element) => neutralStrokeInputRecipe.getValueFor(element).evaluate(element).active);
var neutralStrokeInputFocus = create3("neutral-stroke-input-focus").withDefault((element) => neutralStrokeInputRecipe.getValueFor(element).evaluate(element).focus);
var neutralStrokeLayerRecipe = createNonCss("neutral-stroke-layer-recipe").withDefault({
  evaluate: (element, reference) => {
    return deltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralStrokeLayerRestDelta.getValueFor(element), neutralStrokeLayerHoverDelta.getValueFor(element), neutralStrokeLayerActiveDelta.getValueFor(element), neutralStrokeLayerRestDelta.getValueFor(element));
  }
});
var neutralStrokeLayerRest = create3("neutral-stroke-layer-rest").withDefault((element) => neutralStrokeLayerRecipe.getValueFor(element).evaluate(element).rest);
var neutralStrokeLayerHover = create3("neutral-stroke-layer-hover").withDefault((element) => neutralStrokeLayerRecipe.getValueFor(element).evaluate(element).hover);
var neutralStrokeLayerActive = create3("neutral-stroke-layer-active").withDefault((element) => neutralStrokeLayerRecipe.getValueFor(element).evaluate(element).active);
var neutralStrokeStrongRecipe = createNonCss("neutral-stroke-strong-recipe").withDefault({
  evaluate: (element, reference) => contrastAndDeltaSwatchSet(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), 5.5, 0, neutralStrokeStrongHoverDelta.getValueFor(element), neutralStrokeStrongActiveDelta.getValueFor(element), neutralStrokeStrongFocusDelta.getValueFor(element))
});
var neutralStrokeStrongRest = create3("neutral-stroke-strong-rest").withDefault((element) => neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).rest);
var neutralStrokeStrongHover = create3("neutral-stroke-strong-hover").withDefault((element) => neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).hover);
var neutralStrokeStrongActive = create3("neutral-stroke-strong-active").withDefault((element) => neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).active);
var neutralStrokeStrongFocus = create3("neutral-stroke-strong-focus").withDefault((element) => neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).focus);
var focusStrokeOuterRecipe = createNonCss("focus-stroke-outer-recipe").withDefault({
  evaluate: (element) => focusStrokeOuter(neutralPalette.getValueFor(element), fillColor.getValueFor(element))
});
var focusStrokeOuter2 = create3("focus-stroke-outer").withDefault((element) => focusStrokeOuterRecipe.getValueFor(element).evaluate(element));
var focusStrokeInnerRecipe = createNonCss("focus-stroke-inner-recipe").withDefault({
  evaluate: (element) => focusStrokeInner(accentPalette.getValueFor(element), fillColor.getValueFor(element), focusStrokeOuter2.getValueFor(element))
});
var focusStrokeInner2 = create3("focus-stroke-inner").withDefault((element) => focusStrokeInnerRecipe.getValueFor(element).evaluate(element));
var foregroundOnAccentLargeRecipe = createNonCss("foreground-on-accent-large-recipe").withDefault({
  evaluate: (element) => foregroundOnAccentSet(accentFillRest.getValueFor(element), accentFillHover.getValueFor(element), accentFillActive.getValueFor(element), accentFillFocus.getValueFor(element), ContrastTarget.large)
});
var foregroundOnAccentRestLarge = create3("foreground-on-accent-rest-large").withDefault((element) => foregroundOnAccentLargeRecipe.getValueFor(element).evaluate(element).rest);
var foregroundOnAccentHoverLarge = create3("foreground-on-accent-hover-large").withDefault((element) => foregroundOnAccentLargeRecipe.getValueFor(element).evaluate(element, accentFillHover.getValueFor(element)).hover);
var foregroundOnAccentActiveLarge = create3("foreground-on-accent-active-large").withDefault((element) => foregroundOnAccentLargeRecipe.getValueFor(element).evaluate(element, accentFillActive.getValueFor(element)).active);
var foregroundOnAccentFocusLarge = create3("foreground-on-accent-focus-large").withDefault((element) => foregroundOnAccentLargeRecipe.getValueFor(element).evaluate(element, accentFillFocus.getValueFor(element)).focus);
var neutralFillInverseRestDelta = create3("neutral-fill-inverse-rest-delta").withDefault(0);
var neutralFillInverseHoverDelta = create3("neutral-fill-inverse-hover-delta").withDefault(-3);
var neutralFillInverseActiveDelta = create3("neutral-fill-inverse-active-delta").withDefault(7);
var neutralFillInverseFocusDelta = create3("neutral-fill-inverse-focus-delta").withDefault(0);
function neutralFillInverse(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta) {
  const direction2 = directionByIsDark(reference);
  const accessibleIndex = palette.closestIndexOf(palette.colorContrast(reference, 14));
  const accessibleIndex2 = accessibleIndex + direction2 * Math.abs(restDelta - hoverDelta);
  const indexOneIsRest = direction2 === 1 ? restDelta < hoverDelta : direction2 * restDelta > direction2 * hoverDelta;
  let restIndex;
  let hoverIndex;
  if (indexOneIsRest) {
    restIndex = accessibleIndex;
    hoverIndex = accessibleIndex2;
  } else {
    restIndex = accessibleIndex2;
    hoverIndex = accessibleIndex;
  }
  return {
    rest: palette.get(restIndex),
    hover: palette.get(hoverIndex),
    active: palette.get(restIndex + direction2 * activeDelta),
    focus: palette.get(restIndex + direction2 * focusDelta)
  };
}
var neutralFillInverseRecipe = createNonCss("neutral-fill-inverse-recipe").withDefault({
  evaluate: (element, reference) => neutralFillInverse(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillInverseRestDelta.getValueFor(element), neutralFillInverseHoverDelta.getValueFor(element), neutralFillInverseActiveDelta.getValueFor(element), neutralFillInverseFocusDelta.getValueFor(element))
});
var neutralFillInverseRest = create3("neutral-fill-inverse-rest").withDefault((element) => neutralFillInverseRecipe.getValueFor(element).evaluate(element).rest);
var neutralFillInverseHover = create3("neutral-fill-inverse-hover").withDefault((element) => neutralFillInverseRecipe.getValueFor(element).evaluate(element).hover);
var neutralFillInverseActive = create3("neutral-fill-inverse-active").withDefault((element) => neutralFillInverseRecipe.getValueFor(element).evaluate(element).active);
var neutralFillInverseFocus = create3("neutral-fill-inverse-focus").withDefault((element) => neutralFillInverseRecipe.getValueFor(element).evaluate(element).focus);

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/styles/patterns/type-ramp.js
var typeRampBase = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampBaseFontSize};
  line-height: ${typeRampBaseLineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampBaseFontVariations};
`;
var typeRampMinus1 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampMinus1FontSize};
  line-height: ${typeRampMinus1LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampMinus1FontVariations};
`;
var typeRampMinus2 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampMinus2FontSize};
  line-height: ${typeRampMinus2LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampMinus2FontVariations};
`;
var typeRampPlus1 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampPlus1FontSize};
  line-height: ${typeRampPlus1LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampPlus1FontVariations};
`;
var typeRampPlus2 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampPlus2FontSize};
  line-height: ${typeRampPlus2LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampPlus2FontVariations};
`;
var typeRampPlus3 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampPlus3FontSize};
  line-height: ${typeRampPlus3LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampPlus3FontVariations};
`;
var typeRampPlus4 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampPlus4FontSize};
  line-height: ${typeRampPlus4LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampPlus4FontVariations};
`;
var typeRampPlus5 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampPlus5FontSize};
  line-height: ${typeRampPlus5LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampPlus5FontVariations};
`;
var typeRampPlus6 = cssPartial`
  font-family: ${bodyFont};
  font-size: ${typeRampPlus6FontSize};
  line-height: ${typeRampPlus6LineHeight};
  font-weight: initial;
  font-variation-settings: ${typeRampPlus6FontVariations};
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/accordion/accordion.styles.js
var accordionStyles = (context, definition) => css2`
    ${display("flex")} :host {
      box-sizing: border-box;
      flex-direction: column;
      ${typeRampBase}
      color: ${neutralForegroundRest};
      gap: calc(${designUnit} * 1px);
    }
  `;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/styles/focus.js
var focusTreatmentBase = cssPartial`
  outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter2};
  outline-offset: calc(${focusStrokeWidth} * -1px);
`;
var focusTreatmentTight = cssPartial`
  outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter2};
  outline-offset: calc(${strokeWidth} * 1px);
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/styles/size.js
var heightNumber = cssPartial`(${baseHeightMultiplier} + ${density}) * ${designUnit}`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/accordion/accordion-item/accordion-item.styles.js
var neutralFillStealthRestOnNeutralFillLayerRest = DesignToken.create("neutral-fill-stealth-rest-on-neutral-fill-layer-rest").withDefault((target2) => {
  const baseRecipe = neutralFillLayerRecipe.getValueFor(target2);
  const buttonRecipe = neutralFillStealthRecipe.getValueFor(target2);
  return buttonRecipe.evaluate(target2, baseRecipe.evaluate(target2).rest).rest;
});
var neutralFillStealthHoverOnNeutralFillLayerRest = DesignToken.create("neutral-fill-stealth-hover-on-neutral-fill-layer-rest").withDefault((target2) => {
  const baseRecipe = neutralFillLayerRecipe.getValueFor(target2);
  const buttonRecipe = neutralFillStealthRecipe.getValueFor(target2);
  return buttonRecipe.evaluate(target2, baseRecipe.evaluate(target2).rest).hover;
});
var neutralFillStealthActiveOnNeutralFillLayerRest = DesignToken.create("neutral-fill-stealth-active-on-neutral-fill-layer-rest").withDefault((target2) => {
  const baseRecipe = neutralFillLayerRecipe.getValueFor(target2);
  const buttonRecipe = neutralFillStealthRecipe.getValueFor(target2);
  return buttonRecipe.evaluate(target2, baseRecipe.evaluate(target2).rest).active;
});
var accordionItemStyles = (context, definition) => css2`
    ${display("flex")} :host {
      box-sizing: border-box;
      ${typeRampBase};
      flex-direction: column;
      background: ${neutralFillLayerRest};
      color: ${neutralForegroundRest};
      border: calc(${strokeWidth} * 1px) solid ${neutralStrokeLayerRest};
      border-radius: calc(${layerCornerRadius} * 1px);
    }

    .region {
      display: none;
      padding: calc(${designUnit} * 2 * 1px);
      background: ${neutralFillLayerAltRest};
    }

    .heading {
      display: grid;
      position: relative;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
    }

    .button {
      appearance: none;
      border: none;
      background: none;
      grid-column: 2;
      grid-row: 1;
      outline: none;
      margin: calc(${designUnit} * 3 * 1px) 0;
      padding: 0 calc(${designUnit} * 2 * 1px);
      text-align: left;
      color: inherit;
      cursor: pointer;
      font: inherit;
    }

    .button::before {
      content: '';
      position: absolute;
      top: calc(${strokeWidth} * -1px);
      left: calc(${strokeWidth} * -1px);
      right: calc(${strokeWidth} * -1px);
      bottom: calc(${strokeWidth} * -1px);
      cursor: pointer;
    }

    .button:${focusVisible}::before {
      ${focusTreatmentBase}
      border-radius: calc(${layerCornerRadius} * 1px);
    }

    :host(.expanded) .button:${focusVisible}::before {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    :host(.expanded) .region {
      display: block;
      border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeLayerRest};
      border-bottom-left-radius: calc((${layerCornerRadius} - ${strokeWidth}) * 1px);
      border-bottom-right-radius: calc((${layerCornerRadius} - ${strokeWidth}) * 1px);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-column: 4;
      pointer-events: none;
      background: ${neutralFillStealthRestOnNeutralFillLayerRest};
      border-radius: calc(${controlCornerRadius} * 1px);
      fill: currentcolor;
      width: calc(${heightNumber} * 1px);
      height: calc(${heightNumber} * 1px);
      margin: calc(${designUnit} * 2 * 1px);
    }

    .heading:hover .icon {
      background: ${neutralFillStealthHoverOnNeutralFillLayerRest};
    }

    .heading:active .icon {
      background: ${neutralFillStealthActiveOnNeutralFillLayerRest};
    }

    slot[name='collapsed-icon'] {
      display: flex;
    }

    :host(.expanded) slot[name='collapsed-icon'] {
      display: none;
    }

    slot[name='expanded-icon'] {
      display: none;
    }

    :host(.expanded) slot[name='expanded-icon'] {
      display: flex;
    }

    .start {
      display: flex;
      align-items: center;
      padding-inline-start: calc(${designUnit} * 2 * 1px);
      justify-content: center;
      grid-column: 1;
    }

    .end {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-column: 3;
    }

    .icon,
    .start,
    .end {
      position: relative;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .button:${focusVisible}::before {
          outline-color: ${SystemColors.Highlight};
        }
        .icon {
          fill: ${SystemColors.ButtonText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/accordion/accordion-item/index.js
var fluentAccordionItem = AccordionItem.compose({
  baseName: "accordion-item",
  template: accordionItemTemplate,
  styles: accordionItemStyles,
  collapsedIcon: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `,
  expandedIcon: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 7.35c.2.2.5.2.7 0L6 4.21l3.15 3.14a.5.5 0 10.7-.7l-3.5-3.5a.5.5 0 00-.7 0l-3.5 3.5a.5.5 0 000 .7z"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/accordion/index.js
var fluentAccordion = Accordion.compose({
  baseName: "accordion",
  template: accordionTemplate,
  styles: accordionStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/node_modules/tslib/tslib.es6.mjs
function __decorate2(decorators, target2, key, desc2) {
  var c = arguments.length, r = c < 3 ? target2 : desc2 === null ? desc2 = Object.getOwnPropertyDescriptor(target2, key) : desc2, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target2, key, desc2);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d2 = decorators[i])
        r = (c < 3 ? d2(r) : c > 3 ? d2(target2, key, r) : d2(target2, key)) || r;
  return c > 3 && r && Object.defineProperty(target2, key, r), r;
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/styles/direction.js
var DirectionalStyleSheetBehavior = class {
  constructor(ltr2, rtl2) {
    this.cache = /* @__PURE__ */ new WeakMap();
    this.ltr = ltr2;
    this.rtl = rtl2;
  }
  /**
   * @internal
   */
  bind(source) {
    this.attach(source);
  }
  /**
   * @internal
   */
  unbind(source) {
    const cache2 = this.cache.get(source);
    if (cache2) {
      direction.unsubscribe(cache2);
    }
  }
  attach(source) {
    const subscriber = this.cache.get(source) || new DirectionalStyleSheetBehaviorSubscription(this.ltr, this.rtl, source);
    const value = direction.getValueFor(source);
    direction.subscribe(subscriber);
    subscriber.attach(value);
    this.cache.set(source, subscriber);
  }
};
var DirectionalStyleSheetBehaviorSubscription = class {
  constructor(ltr2, rtl2, source) {
    this.ltr = ltr2;
    this.rtl = rtl2;
    this.source = source;
    this.attached = null;
  }
  handleChange({ target: target2, token }) {
    this.attach(token.getValueFor(this.source));
  }
  attach(direction2) {
    if (this.attached !== this[direction2]) {
      if (this.attached !== null) {
        this.source.$fastController.removeStyles(this.attached);
      }
      this.attached = this[direction2];
      if (this.attached !== null) {
        this.source.$fastController.addStyles(this.attached);
      }
    }
  }
};

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/styles/elevation.js
var ambientShadow = "0 0 2px rgba(0, 0, 0, 0.14)";
var directionalShadow = "0 calc(var(--elevation) * 0.5px) calc((var(--elevation) * 1px)) rgba(0, 0, 0, 0.2)";
var elevation = `box-shadow: ${ambientShadow}, ${directionalShadow};`;
var elevationShadowRecipe = DesignToken.create({
  name: "elevation-shadow",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (element, size, reference) => {
    let ambientOpacity = 0.12;
    let directionalOpacity = 0.14;
    if (size > 16) {
      ambientOpacity = 0.2;
      directionalOpacity = 0.24;
    }
    const ambient = `0 0 2px rgba(0, 0, 0, ${ambientOpacity})`;
    const directional = `0 calc(${size} * 0.5px) calc((${size} * 1px)) rgba(0, 0, 0, ${directionalOpacity})`;
    return `${ambient}, ${directional}`;
  }
});
var elevationShadowCardRestSize = DesignToken.create("elevation-shadow-card-rest-size").withDefault(4);
var elevationShadowCardHoverSize = DesignToken.create("elevation-shadow-card-hover-size").withDefault(8);
var elevationShadowCardActiveSize = DesignToken.create("elevation-shadow-card-active-size").withDefault(0);
var elevationShadowCardFocusSize = DesignToken.create("elevation-shadow-card-focus-size").withDefault(8);
var elevationShadowCardRest = DesignToken.create("elevation-shadow-card-rest").withDefault((element) => elevationShadowRecipe.getValueFor(element).evaluate(element, elevationShadowCardRestSize.getValueFor(element)));
var elevationShadowCardHover = DesignToken.create("elevation-shadow-card-hover").withDefault((element) => elevationShadowRecipe.getValueFor(element).evaluate(element, elevationShadowCardHoverSize.getValueFor(element)));
var elevationShadowCardActive = DesignToken.create("elevation-shadow-card-active").withDefault((element) => elevationShadowRecipe.getValueFor(element).evaluate(element, elevationShadowCardActiveSize.getValueFor(element)));
var elevationShadowCardFocus = DesignToken.create("elevation-shadow-card-focus").withDefault((element) => elevationShadowRecipe.getValueFor(element).evaluate(element, elevationShadowCardFocusSize.getValueFor(element)));
var elevationShadowTooltipSize = DesignToken.create("elevation-shadow-tooltip-size").withDefault(16);
var elevationShadowTooltip = DesignToken.create("elevation-shadow-tooltip").withDefault((element) => elevationShadowRecipe.getValueFor(element).evaluate(element, elevationShadowTooltipSize.getValueFor(element)));
var elevationShadowFlyoutSize = DesignToken.create("elevation-shadow-flyout-size").withDefault(32);
var elevationShadowFlyout = DesignToken.create("elevation-shadow-flyout").withDefault((element) => elevationShadowRecipe.getValueFor(element).evaluate(element, elevationShadowFlyoutSize.getValueFor(element)));
var elevationShadowDialogSize = DesignToken.create("elevation-shadow-dialog-size").withDefault(128);
var elevationShadowDialog = DesignToken.create("elevation-shadow-dialog").withDefault((element) => elevationShadowRecipe.getValueFor(element).evaluate(element, elevationShadowDialogSize.getValueFor(element)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/styles/patterns/button.styles.js
var baseButtonStyles = (context, definition, interactivitySelector5, nonInteractivitySelector3 = "[disabled]") => css2`
    ${display("inline-flex")}
    
    :host {
      position: relative;
      box-sizing: border-box;
      ${typeRampBase}
      height: calc(${heightNumber} * 1px);
      min-width: calc(${heightNumber} * 1px);
      color: ${neutralForegroundRest};
      border-radius: calc(${controlCornerRadius} * 1px);
      fill: currentcolor;
    }

    .control {
      border: calc(${strokeWidth} * 1px) solid transparent;
      flex-grow: 1;
      box-sizing: border-box;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
      white-space: nowrap;
      outline: none;
      text-decoration: none;
      color: inherit;
      border-radius: inherit;
      fill: inherit;
      font-family: inherit;
    }

    .control,
    .end,
    .start {
      font: inherit;
    }

    .control.icon-only {
      padding: 0;
      line-height: 0;
    }

    .control:${focusVisible} {
      ${focusTreatmentBase}
    }

    .control::-moz-focus-inner {
      border: 0;
    }

    .content {
      pointer-events: none;
    }

    .start,
    .end {
      display: flex;
      pointer-events: none;
    }

    .start {
      margin-inline-end: 11px;
    }

    .end {
      margin-inline-start: 11px;
    }
  `;
var NeutralButtonStyles = (context, definition, interactivitySelector5, nonInteractivitySelector3 = "[disabled]") => css2`
    .control {
      background: padding-box linear-gradient(${neutralFillRest}, ${neutralFillRest}),
        border-box ${neutralStrokeControlRest};
    }

    :host(${interactivitySelector5}:hover) .control {
      background: padding-box linear-gradient(${neutralFillHover}, ${neutralFillHover}),
        border-box ${neutralStrokeControlHover};
    }

    :host(${interactivitySelector5}:active) .control {
      background: padding-box linear-gradient(${neutralFillActive}, ${neutralFillActive}),
        border-box ${neutralStrokeControlActive};
    }

    :host(${nonInteractivitySelector3}) .control {
      background: padding-box linear-gradient(${neutralFillRest}, ${neutralFillRest}),
        border-box ${neutralStrokeRest};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .control {
          background: ${SystemColors.ButtonFace};
          border-color: ${SystemColors.ButtonText};
          color: ${SystemColors.ButtonText};
        }

        :host(${interactivitySelector5}:hover) .control,
        :host(${interactivitySelector5}:active) .control {
          forced-color-adjust: none;
          background: ${SystemColors.HighlightText};
          border-color: ${SystemColors.Highlight};
          color: ${SystemColors.Highlight};
        }

        :host(${nonInteractivitySelector3}) .control {
          background: transparent;
          border-color: ${SystemColors.GrayText};
          color: ${SystemColors.GrayText};
        }

        .control:${focusVisible} {
          outline-color: ${SystemColors.CanvasText};
        }

        :host([href]) .control {
          background: transparent;
          border-color: ${SystemColors.LinkText};
          color: ${SystemColors.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          background: transparent;
          border-color: ${SystemColors.CanvasText};
          color: ${SystemColors.CanvasText};
        }
    `));
var AccentButtonStyles = (context, definition, interactivitySelector5, nonInteractivitySelector3 = "[disabled]") => css2`
    .control {
      background: padding-box linear-gradient(${accentFillRest}, ${accentFillRest}),
        border-box ${accentStrokeControlRest};
      color: ${foregroundOnAccentRest};
    }

    :host(${interactivitySelector5}:hover) .control {
      background: padding-box linear-gradient(${accentFillHover}, ${accentFillHover}),
        border-box ${accentStrokeControlHover};
      color: ${foregroundOnAccentHover};
    }

    :host(${interactivitySelector5}:active) .control {
      background: padding-box linear-gradient(${accentFillActive}, ${accentFillActive}),
        border-box ${accentStrokeControlActive};
      color: ${foregroundOnAccentActive};
    }

    :host(${nonInteractivitySelector3}) .control {
      background: ${accentFillRest};
    }

    .control:${focusVisible} {
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeInner2} inset !important;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .control {
          forced-color-adjust: none;
          background: ${SystemColors.Highlight};
          color: ${SystemColors.HighlightText};
        }

        :host(${interactivitySelector5}:hover) .control,
        :host(${interactivitySelector5}:active) .control {
          background: ${SystemColors.HighlightText};
          border-color: ${SystemColors.Highlight};
          color: ${SystemColors.Highlight};
        }

        :host(${nonInteractivitySelector3}) .control {
          background: transparent;
          border-color: ${SystemColors.GrayText};
          color: ${SystemColors.GrayText};
        }

        .control:${focusVisible} {
          outline-color: ${SystemColors.CanvasText};
          box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.HighlightText} inset !important;
        }

        :host([href]) .control {
          background: ${SystemColors.LinkText};
          color: ${SystemColors.HighlightText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          background: ${SystemColors.ButtonFace};
          border-color: ${SystemColors.LinkText};
          color: ${SystemColors.LinkText};
        }
      `));
var HypertextStyles = (context, definition, interactivitySelector5, nonInteractivitySelector3 = "[disabled]") => css2`
    :host {
      height: auto;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      min-width: 0;
    }

    .control {
      display: inline;
      padding: 0;
      border: none;
      box-shadow: none;
      line-height: 1;
    }

    :host(${interactivitySelector5}) .control {
      color: ${accentForegroundRest};
      text-decoration: underline 1px;
    }

    :host(${interactivitySelector5}:hover) .control {
      color: ${accentForegroundHover};
      text-decoration: none;
    }

    :host(${interactivitySelector5}:active) .control {
      color: ${accentForegroundActive};
      text-decoration: none;
    }

    .control:${focusVisible} {
      ${focusTreatmentTight}
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host(${interactivitySelector5}) .control {
          color: ${SystemColors.LinkText};
        }

        :host(${interactivitySelector5}:hover) .control,
        :host(${interactivitySelector5}:active) .control {
          color: ${SystemColors.CanvasText};
        }

        .control:${focusVisible} {
          outline-color: ${SystemColors.CanvasText};
        }
      `));
var LightweightButtonStyles = (context, definition, interactivitySelector5, nonInteractivitySelector3 = "[disabled]") => css2`
    :host {
      color: ${accentForegroundRest};
    }

    .control {
      background: ${neutralFillStealthRest};
    }

    :host(${interactivitySelector5}:hover) .control {
      background: ${neutralFillStealthHover};
      color: ${accentForegroundHover};
    }

    :host(${interactivitySelector5}:active) .control {
      background: ${neutralFillStealthActive};
      color: ${accentForegroundActive};
    }

    :host(${nonInteractivitySelector3}) .control {
      background: ${neutralFillStealthRest};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host {
          color: ${SystemColors.ButtonText};
        }

        .control {
          forced-color-adjust: none;
          background: transparent;
        }

        :host(${interactivitySelector5}:hover) .control,
        :host(${interactivitySelector5}:active) .control {
          background: transparent;
          border-color: ${SystemColors.ButtonText};
          color: ${SystemColors.ButtonText};
        }

        :host(${nonInteractivitySelector3}) .control {
          background: transparent;
          color: ${SystemColors.GrayText};
        }

        .control:${focusVisible} {
          outline-color: ${SystemColors.CanvasText};
        }

        :host([href]) .control {
          color: ${SystemColors.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          border-color: ${SystemColors.LinkText};
          color: ${SystemColors.LinkText};
        }
      `));
var OutlineButtonStyles = (context, definition, interactivitySelector5, nonInteractivitySelector3 = "[disabled]") => css2`
    .control {
      background: transparent !important;
      border-color: ${neutralStrokeRest};
    }

    :host(${interactivitySelector5}:hover) .control {
      border-color: ${neutralStrokeHover};
    }

    :host(${interactivitySelector5}:active) .control {
      border-color: ${neutralStrokeActive};
    }

    :host(${nonInteractivitySelector3}) .control {
      background: transparent !important;
      border-color: ${neutralStrokeRest};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .control {
          border-color: ${SystemColors.ButtonText};
          color: ${SystemColors.ButtonText};
        }

        :host(${interactivitySelector5}:hover) .control,
        :host(${interactivitySelector5}:active) .control {
          background: ${SystemColors.HighlightText};
          border-color: ${SystemColors.Highlight};
          color: ${SystemColors.Highlight};
        }

        :host(${nonInteractivitySelector3}) .control {
          border-color: ${SystemColors.GrayText};
          color: ${SystemColors.GrayText};
        }

        .control:${focusVisible} {
          outline-color: ${SystemColors.CanvasText};
        }

        :host([href]) .control {
          border-color: ${SystemColors.LinkText};
          color: ${SystemColors.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          border-color: ${SystemColors.CanvasText};
          color: ${SystemColors.CanvasText};
        }
      `));
var StealthButtonStyles = (context, definition, interactivitySelector5, nonInteractivitySelector3 = "[disabled]") => css2`
    .control {
      background: ${neutralFillStealthRest};
    }

    :host(${interactivitySelector5}:hover) .control {
      background: ${neutralFillStealthHover};
    }

    :host(${interactivitySelector5}:active) .control {
      background: ${neutralFillStealthActive};
    }

    :host(${nonInteractivitySelector3}) .control {
      background: ${neutralFillStealthRest};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .control {
          forced-color-adjust: none;
          background: transparent;
          color: ${SystemColors.ButtonText};
        }

        :host(${interactivitySelector5}:hover) .control,
        :host(${interactivitySelector5}:active) .control {
          background: transparent;
          border-color: ${SystemColors.ButtonText};
          color: ${SystemColors.ButtonText};
        }

        :host(${nonInteractivitySelector3}) .control {
          background: transparent;
          color: ${SystemColors.GrayText};
        }
        
        .control:${focusVisible} {
          outline-color: ${SystemColors.CanvasText};
        }

        :host([href]) .control {
          color: ${SystemColors.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          background: transparent;
          border-color: ${SystemColors.LinkText};
          color: ${SystemColors.LinkText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/styles/patterns/input.styles.js
var placeholderRest = DesignToken.create("input-placeholder-rest").withDefault((target2) => {
  const baseRecipe = neutralFillInputRecipe.getValueFor(target2);
  const hintRecipe = neutralForegroundHintRecipe.getValueFor(target2);
  return hintRecipe.evaluate(target2, baseRecipe.evaluate(target2).rest);
});
var placeholderHover = DesignToken.create("input-placeholder-hover").withDefault((target2) => {
  const baseRecipe = neutralFillInputRecipe.getValueFor(target2);
  const hintRecipe = neutralForegroundHintRecipe.getValueFor(target2);
  return hintRecipe.evaluate(target2, baseRecipe.evaluate(target2).hover);
});
var filledPlaceholderRest = DesignToken.create("input-filled-placeholder-rest").withDefault((target2) => {
  const baseRecipe = neutralFillSecondaryRecipe.getValueFor(target2);
  const hintRecipe = neutralForegroundHintRecipe.getValueFor(target2);
  return hintRecipe.evaluate(target2, baseRecipe.evaluate(target2).rest);
});
var filledPlaceholderHover = DesignToken.create("input-filled-placeholder-hover").withDefault((target2) => {
  const baseRecipe = neutralFillSecondaryRecipe.getValueFor(target2);
  const hintRecipe = neutralForegroundHintRecipe.getValueFor(target2);
  return hintRecipe.evaluate(target2, baseRecipe.evaluate(target2).hover);
});
var baseInputStyles = (context, definition, logicalControlSelector7) => css2`
  :host {
    ${typeRampBase}
    color: ${neutralForegroundRest};
    fill: currentcolor;
    user-select: none;
    position: relative;
  }

  ${logicalControlSelector7} {
    box-sizing: border-box;
    position: relative;
    color: inherit;
    border: calc(${strokeWidth} * 1px) solid transparent;
    border-radius: calc(${controlCornerRadius} * 1px);
    height: calc(${heightNumber} * 1px);
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .control {
    width: 100%;
    outline: none;
  }

  .label {
    display: block;
    color: ${neutralForegroundRest};
    cursor: pointer;
    ${typeRampBase}
    margin-bottom: 4px;
  }

  .label__hidden {
    display: none;
    visibility: hidden;
  }

  :host([disabled]) ${logicalControlSelector7},
  :host([readonly]) ${logicalControlSelector7},
  :host([disabled]) .label,
  :host([readonly]) .label,
  :host([disabled]) .control,
  :host([readonly]) .control {
    cursor: ${disabledCursor};
  }

  :host([disabled]) {
    opacity: ${disabledOpacity};
  }
`;
var inputStateStyles = (context, definition, logicalControlSelector7) => css2`
  @media (forced-colors: none) {
    :host(:not([disabled]):active)::after {
      left: 50%;
      width: 40%;
      transform: translateX(-50%);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    :host(:not([disabled]):focus-within)::after {
      left: 0;
      width: 100%;
      transform: none;
    }

    :host(:not([disabled]):active)::after,
    :host(:not([disabled]):focus-within:not(:active))::after {
      content: '';
      position: absolute;
      height: calc(${focusStrokeWidth} * 1px);
      bottom: 0;
      border-bottom: calc(${focusStrokeWidth} * 1px) solid ${accentFillRest};
      border-bottom-left-radius: calc(${controlCornerRadius} * 1px);
      border-bottom-right-radius: calc(${controlCornerRadius} * 1px);
      z-index: 2;
      transition: all 300ms cubic-bezier(0.1, 0.9, 0.2, 1);
    }
  }
`;
var inputOutlineStyles = (context, definition, logicalControlSelector7, interactivitySelector5 = ":not([disabled]):not(:focus-within)") => css2`
  ${logicalControlSelector7} {
    background: padding-box linear-gradient(${neutralFillInputRest}, ${neutralFillInputRest}),
      border-box ${neutralStrokeInputRest};
  }

  :host(${interactivitySelector5}:hover) ${logicalControlSelector7} {
    background: padding-box linear-gradient(${neutralFillInputHover}, ${neutralFillInputHover}),
      border-box ${neutralStrokeInputHover};
  }

  :host(:not([disabled]):focus-within) ${logicalControlSelector7} {
    background: padding-box linear-gradient(${neutralFillInputFocus}, ${neutralFillInputFocus}),
      border-box ${neutralStrokeInputRest};
  }
  
  :host([disabled]) ${logicalControlSelector7} {
    background: padding-box linear-gradient(${neutralFillInputRest}, ${neutralFillInputRest}),
      border-box ${neutralStrokeRest};
  }

  .control::placeholder {
    color: ${placeholderRest};
  }

  :host(${interactivitySelector5}:hover) .control::placeholder {
    color: ${placeholderHover};
  }
`;
var inputFilledStyles = (context, definition, logicalControlSelector7, interactivitySelector5 = ":not([disabled]):not(:focus-within)") => css2`
  ${logicalControlSelector7} {
    background: ${neutralFillSecondaryRest};
  }

  :host(${interactivitySelector5}:hover) ${logicalControlSelector7} {
    background: ${neutralFillSecondaryHover};
  }

  :host(:not([disabled]):focus-within) ${logicalControlSelector7} {
    background: ${neutralFillSecondaryFocus};
  }

  :host([disabled]) ${logicalControlSelector7} {
    background: ${neutralFillSecondaryRest};
  }

  .control::placeholder {
    color: ${filledPlaceholderRest};
  }

  :host(${interactivitySelector5}:hover) .control::placeholder {
    color: ${filledPlaceholderHover};
  }
`;
var inputForcedColorStyles = (context, definition, logicalControlSelector7, interactivitySelector5 = ":not([disabled]):not(:focus-within)") => css2`
  :host {
    color: ${SystemColors.ButtonText};
  }

  ${logicalControlSelector7} {
    background: ${SystemColors.ButtonFace};
    border-color: ${SystemColors.ButtonText};
  }

  :host(${interactivitySelector5}:hover) ${logicalControlSelector7},
  :host(:not([disabled]):focus-within) ${logicalControlSelector7} {
    border-color: ${SystemColors.Highlight};
  }

  :host([disabled]) ${logicalControlSelector7} {
    opacity: 1;
    background: ${SystemColors.ButtonFace};
    border-color: ${SystemColors.GrayText};
  }

  .control::placeholder,
  :host(${interactivitySelector5}:hover) .control::placeholder {
    color: ${SystemColors.CanvasText};
  }

  :host(:not([disabled]):focus) ${logicalControlSelector7} {
    ${focusTreatmentBase}
    outline-color: ${SystemColors.Highlight};
  }

  :host([disabled]) {
    opacity: 1;
    color: ${SystemColors.GrayText};
  }

  :host([disabled]) ::placeholder,
  :host([disabled]) ::-webkit-input-placeholder {
    color: ${SystemColors.GrayText};
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/utilities/behaviors.js
function appearanceBehavior(value, styles) {
  return new PropertyStyleSheetBehavior("appearance", value, styles);
}

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/anchor/anchor.styles.js
var interactivitySelector = "[href]";
var anchorStyles = (context, definition) => baseButtonStyles(context, definition, interactivitySelector).withBehaviors(appearanceBehavior("neutral", NeutralButtonStyles(context, definition, interactivitySelector)), appearanceBehavior("accent", AccentButtonStyles(context, definition, interactivitySelector)), appearanceBehavior("hypertext", HypertextStyles(context, definition, interactivitySelector)), appearanceBehavior("lightweight", LightweightButtonStyles(context, definition, interactivitySelector)), appearanceBehavior("outline", OutlineButtonStyles(context, definition, interactivitySelector)), appearanceBehavior("stealth", StealthButtonStyles(context, definition, interactivitySelector)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/anchor/index.js
var Anchor2 = class extends Anchor {
  appearanceChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.classList.add(newValue);
      this.classList.remove(oldValue);
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.appearance) {
      this.appearance = "neutral";
    }
  }
  /**
   * Applies 'icon-only' class when there is only an SVG in the default slot
   *
   * @internal
   */
  defaultSlottedContentChanged() {
    var _a, _b;
    const slottedElements = this.defaultSlottedContent.filter((x) => x.nodeType === Node.ELEMENT_NODE);
    if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
      (_a = this.control) === null || _a === void 0 ? void 0 : _a.classList.add("icon-only");
    } else {
      (_b = this.control) === null || _b === void 0 ? void 0 : _b.classList.remove("icon-only");
    }
  }
};
__decorate2([
  attr
], Anchor2.prototype, "appearance", void 0);
var fluentAnchor = Anchor2.compose({
  baseName: "anchor",
  baseClass: Anchor,
  template: anchorTemplate,
  styles: anchorStyles,
  shadowOptions: {
    delegatesFocus: true
  }
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/anchored-region/anchored-region.styles.js
var anchoredRegionStyles = (context, definition) => css2`
  :host {
    contain: layout;
    display: block;
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/anchored-region/index.js
var fluentAnchoredRegion = AnchoredRegion.compose({
  baseName: "anchored-region",
  template: anchoredRegionTemplate,
  styles: anchoredRegionStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/badge/badge.styles.js
var badgeStyles = (context, definition) => css2`
    ${display("inline-block")} :host {
      box-sizing: border-box;
      ${typeRampMinus1};
    }

    .control {
      border-radius: calc(${controlCornerRadius} * 1px);
      padding: calc(((${designUnit} * 0.5) - ${strokeWidth}) * 1px) calc((${designUnit} - ${strokeWidth}) * 1px);
      border: calc(${strokeWidth} * 1px) solid transparent;
    }

    :host(.lightweight) .control {
      background: transparent;
      color: ${neutralForegroundRest};
      font-weight: 600;
    }

    :host(.accent) .control {
      background: ${accentFillRest};
      color: ${foregroundOnAccentRest};
    }

    :host(.neutral) .control {
      background: ${neutralFillSecondaryRest};
      color: ${neutralForegroundRest};
    }

    :host([circular]) .control {
      border-radius: 100px;
      min-width: calc(${typeRampMinus1LineHeight} - calc(${designUnit} * 1px));
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/badge/index.js
var Badge2 = class extends Badge {
  constructor() {
    super(...arguments);
    this.appearance = "lightweight";
  }
  appearanceChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      DOM.queueUpdate(() => {
        this.classList.add(newValue);
        this.classList.remove(oldValue);
      });
    }
  }
};
__decorate2([
  attr({ mode: "fromView" })
], Badge2.prototype, "appearance", void 0);
var fluentBadge = Badge2.compose({
  baseName: "badge",
  baseClass: Badge,
  template: badgeTemplate,
  styles: badgeStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/breadcrumb/breadcrumb.styles.js
var breadcrumbStyles = (context, definition) => css2`
  ${display("inline-block")} :host {
    box-sizing: border-box;
    ${typeRampBase};
  }

  .list {
    display: flex;
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/breadcrumb/index.js
var fluentBreadcrumb = Breadcrumb.compose({
  baseName: "breadcrumb",
  template: breadcrumbTemplate,
  styles: breadcrumbStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/breadcrumb-item/breadcrumb-item.styles.js
var breadcrumbItemStyles = (context, definition) => css2`
    ${display("inline-flex")} :host {
      background: transparent;
      color: ${neutralForegroundRest};
      fill: currentcolor;
      box-sizing: border-box;
      ${typeRampBase};
      min-width: calc(${heightNumber} * 1px);
      border-radius: calc(${controlCornerRadius} * 1px);
    }

    .listitem {
      display: flex;
      align-items: center;
      border-radius: inherit;
    }

    .control {
      position: relative;
      align-items: center;
      box-sizing: border-box;
      color: inherit;
      fill: inherit;
      cursor: pointer;
      display: flex;
      outline: none;
      text-decoration: none;
      white-space: nowrap;
      border-radius: inherit;
    }

    .control:hover {
      color: ${neutralForegroundHover};
    }

    .control:active {
      color: ${neutralForegroundActive};
    }

    .control:${focusVisible} {
      ${focusTreatmentTight}
    }

    :host(:not([href])),
    :host([aria-current]) .control {
      color: ${neutralForegroundRest};
      fill: currentcolor;
      cursor: default;
    }

    .start {
      display: flex;
      margin-inline-end: 6px;
    }

    .end {
      display: flex;
      margin-inline-start: 6px;
    }

    .separator {
      display: flex;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host(:not([href])),
        .start,
        .end,
        .separator {
          background: ${SystemColors.ButtonFace};
          color: ${SystemColors.ButtonText};
          fill: currentcolor;
        }
        .separator {
          fill: ${SystemColors.ButtonText};
        }
        :host([href]) {
          forced-color-adjust: none;
          background: ${SystemColors.ButtonFace};
          color: ${SystemColors.LinkText};
        }
        :host([href]) .control:hover {
          background: ${SystemColors.LinkText};
          color: ${SystemColors.HighlightText};
          fill: currentcolor;
        }
        .control:${focusVisible} {
          outline-color: ${SystemColors.LinkText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/breadcrumb-item/index.js
var fluentBreadcrumbItem = BreadcrumbItem.compose({
  baseName: "breadcrumb-item",
  template: breadcrumbItemTemplate,
  styles: breadcrumbItemStyles,
  shadowOptions: {
    delegatesFocus: true
  },
  separator: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.65 2.15a.5.5 0 000 .7L7.79 6 4.65 9.15a.5.5 0 10.7.7l3.5-3.5a.5.5 0 000-.7l-3.5-3.5a.5.5 0 00-.7 0z"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/button/button.styles.js
var interactivitySelector2 = ":not([disabled])";
var nonInteractivitySelector = "[disabled]";
var buttonStyles = (context, definition) => css2`
    :host(${interactivitySelector2}) .control {
      cursor: pointer;
    }

    :host(${nonInteractivitySelector}) .control {
      cursor: ${disabledCursor};
    }

    @media (forced-colors: none) {
      :host(${nonInteractivitySelector}) .control {
        opacity: ${disabledOpacity};
      }
    }

    ${baseButtonStyles(context, definition, interactivitySelector2, nonInteractivitySelector)}
  `.withBehaviors(appearanceBehavior("neutral", NeutralButtonStyles(context, definition, interactivitySelector2, nonInteractivitySelector)), appearanceBehavior("accent", AccentButtonStyles(context, definition, interactivitySelector2, nonInteractivitySelector)), appearanceBehavior("lightweight", LightweightButtonStyles(context, definition, interactivitySelector2, nonInteractivitySelector)), appearanceBehavior("outline", OutlineButtonStyles(context, definition, interactivitySelector2, nonInteractivitySelector)), appearanceBehavior("stealth", StealthButtonStyles(context, definition, interactivitySelector2, nonInteractivitySelector)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/button/index.js
var Button2 = class extends Button {
  appearanceChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.classList.add(newValue);
      this.classList.remove(oldValue);
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.appearance) {
      this.appearance = "neutral";
    }
  }
  /**
   * Applies 'icon-only' class when there is only an SVG in the default slot
   *
   * @internal
   */
  defaultSlottedContentChanged() {
    const slottedElements = this.defaultSlottedContent.filter((x) => x.nodeType === Node.ELEMENT_NODE);
    if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
      this.control.classList.add("icon-only");
    } else {
      this.control.classList.remove("icon-only");
    }
  }
};
__decorate2([
  attr
], Button2.prototype, "appearance", void 0);
var fluentButton = Button2.compose({
  baseName: "button",
  baseClass: Button,
  template: buttonTemplate,
  styles: buttonStyles,
  shadowOptions: {
    delegatesFocus: true
  }
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/calendar/calendar.styles.js
var ltrStyles = css2`
.day.disabled::before {
  transform: translate(-50%, 0) rotate(45deg);
}
`;
var rtlStyles = css2`
.day.disabled::before {
  transform: translate(50%, 0) rotate(-45deg);
}
`;
var calendarStyles = (context, definition) => css2`
${display("inline-block")} :host {
  --calendar-cell-size: calc((${baseHeightMultiplier} + 2 + ${density}) * ${designUnit} * 1px);
  --calendar-gap: 2px;
  ${typeRampBase}
  color: ${neutralForegroundRest};
}

.title {
  padding: calc(${designUnit} * 2px);
  font-weight: 600;
}

.days {
  text-align: center;
}

.week-days,
.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: var(--calendar-gap);
  border: 0;
  padding: 0;
}

.day,
.week-day {
  border: 0;
  width: var(--calendar-cell-size);
  height: var(--calendar-cell-size);
  line-height: var(--calendar-cell-size);
  padding: 0;
  box-sizing: initial;
}

.week-day {
  font-weight: 600;
}

.day {
  border: calc(${strokeWidth} * 1px) solid transparent;
  border-radius: calc(${controlCornerRadius} * 1px);
}

.interact .day {
  cursor: pointer;
}

.date {
  height: 100%;
}

.inactive .date,
.inactive.disabled::before {
  color: ${neutralForegroundHint};
}

.disabled::before {
  content: '';
  display: inline-block;
  width: calc(var(--calendar-cell-size) * .8);
  height: calc(${strokeWidth} * 1px);
  background: currentColor;
  position: absolute;
  margin-top: calc(var(--calendar-cell-size) / 2);
  transform-origin: center;
  z-index: 1;
}

.selected {
  color: ${accentFillRest};
  border: 1px solid ${accentFillRest};
  background: ${fillColor};
}

.selected + .selected {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  border-inline-start-width: 0;
  padding-inline-start: calc(var(--calendar-gap) + (${strokeWidth} + ${controlCornerRadius}) * 1px);
  margin-inline-start: calc((${controlCornerRadius} * -1px) - var(--calendar-gap));
}

.today.disabled::before {
  color: ${foregroundOnAccentRest};
}

.today .date {
  color: ${foregroundOnAccentRest};
  background: ${accentFillRest};
  border-radius: 50%;
  position: relative;
}
`.withBehaviors(forcedColorsStylesheetBehavior(css2`
          .day.selected {
              color: ${SystemColors.Highlight};
          }

          .today .date {
              background: ${SystemColors.Highlight};
              color: ${SystemColors.HighlightText};
          }
      `), new DirectionalStyleSheetBehavior(ltrStyles, rtlStyles));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/calendar/index.js
var Calendar2 = class extends Calendar {
  constructor() {
    super(...arguments);
    this.readonly = true;
  }
};
__decorate2([
  attr({ converter: booleanConverter })
], Calendar2.prototype, "readonly", void 0);
var fluentCalendar = Calendar2.compose({
  baseName: "calendar",
  template: calendarTemplate,
  styles: calendarStyles,
  title: CalendarTitleTemplate
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/card/card.styles.js
var cardStyles = (context, definition) => css2`
    ${display("block")} :host {
      display: block;
      contain: content;
      height: var(--card-height, 100%);
      width: var(--card-width, 100%);
      box-sizing: border-box;
      background: ${fillColor};
      color: ${neutralForegroundRest};
      border: calc(${strokeWidth} * 1px) solid ${neutralStrokeLayerRest};
      border-radius: calc(${layerCornerRadius} * 1px);
      box-shadow: ${elevationShadowCardRest};
    }

    :host {
      content-visibility: auto;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host {
          background: ${SystemColors.Canvas};
          color: ${SystemColors.CanvasText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/card/index.js
var Card2 = class extends Card {
  cardFillColorChanged(prev, next) {
    if (next) {
      const parsedColor = parseColorHexRGB(next);
      if (parsedColor !== null) {
        this.neutralPaletteSource = next;
        fillColor.setValueFor(this, SwatchRGB.create(parsedColor.r, parsedColor.g, parsedColor.b));
      }
    }
  }
  neutralPaletteSourceChanged(prev, next) {
    if (next) {
      const color = parseColorHexRGB(next);
      const swatch = SwatchRGB.create(color.r, color.g, color.b);
      neutralPalette.setValueFor(this, PaletteRGB.create(swatch));
    }
  }
  /**
   * @internal
   */
  handleChange(source, propertyName) {
    if (!this.cardFillColor) {
      fillColor.setValueFor(this, (target2) => neutralFillLayerRecipe.getValueFor(target2).evaluate(target2, fillColor.getValueFor(source)).rest);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    const parent = composedParent(this);
    if (parent) {
      const parentNotifier = Observable.getNotifier(parent);
      parentNotifier.subscribe(this, "fillColor");
      parentNotifier.subscribe(this, "neutralPalette");
      this.handleChange(parent, "fillColor");
    }
  }
};
__decorate2([
  attr({
    attribute: "card-fill-color",
    mode: "fromView"
  })
], Card2.prototype, "cardFillColor", void 0);
__decorate2([
  attr({
    attribute: "neutral-palette-source",
    mode: "fromView"
  })
], Card2.prototype, "neutralPaletteSource", void 0);
var fluentCard = Card2.compose({
  baseName: "card",
  baseClass: Card,
  template: cardTemplate,
  styles: cardStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/checkbox/checkbox.styles.js
var checkboxStyles = (context, definition) => css2`
    ${display("inline-flex")} :host {
      align-items: center;
      outline: none;
      ${/*
 * Chromium likes to select label text or the default slot when
 * the checkbox is clicked. Maybe there is a better solution here?
 */
""} user-select: none;
    }

    .control {
      position: relative;
      width: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
      height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
      box-sizing: border-box;
      border-radius: calc(${controlCornerRadius} * 1px);
      border: calc(${strokeWidth} * 1px) solid ${neutralStrokeStrongRest};
      background: ${neutralFillInputAltRest};
      cursor: pointer;
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      ${typeRampBase}
      color: ${neutralForegroundRest};
      ${/* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */
""} padding-inline-start: calc(${designUnit} * 2px + 2px);
      margin-inline-end: calc(${designUnit} * 2px + 2px);
      cursor: pointer;
    }

    slot[name='checked-indicator'],
    slot[name='indeterminate-indicator'] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      fill: ${neutralForegroundRest};
      opacity: 0;
      pointer-events: none;
    }

    slot[name='indeterminate-indicator'] {
      position: absolute;
      top: 0;
    }

    :host(.checked) slot[name='checked-indicator'],
    :host(.checked) slot[name='indeterminate-indicator'] {
      fill: ${foregroundOnAccentRest};
    }

    :host(:not(.disabled):hover) .control {
      background: ${neutralFillInputAltHover};
      border-color: ${neutralStrokeStrongHover};
    }

    :host(:not(.disabled):active) .control {
      background: ${neutralFillInputAltActive};
      border-color: ${neutralStrokeStrongActive};
    }

    :host(:${focusVisible}) .control {
      background: ${neutralFillInputAltFocus};
      ${focusTreatmentTight}
    }

    :host(.checked) .control {
      background: ${accentFillRest};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):hover) .control {
      background: ${accentFillHover};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):active) .control {
      background: ${accentFillActive};
      border-color: transparent;
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
      cursor: ${disabledCursor};
    }

    :host(.checked:not(.indeterminate)) slot[name='checked-indicator'],
    :host(.indeterminate) slot[name='indeterminate-indicator'] {
      opacity: 1;
    }

    :host(.disabled) {
      opacity: ${disabledOpacity};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .control {
          border-color: ${SystemColors.FieldText};
          background: ${SystemColors.Field};
        }
        :host(:not(.disabled):hover) .control,
        :host(:not(.disabled):active) .control {
          border-color: ${SystemColors.Highlight};
          background: ${SystemColors.Field};
        }
        slot[name='checked-indicator'],
        slot[name='indeterminate-indicator'] {
          fill: ${SystemColors.FieldText};
        }
        :host(:${focusVisible}) .control {
          forced-color-adjust: none;
          outline-color: ${SystemColors.FieldText};
          background: ${SystemColors.Field};
          border-color: ${SystemColors.Highlight};
        }
        :host(.checked) .control {
          background: ${SystemColors.Highlight};
          border-color: ${SystemColors.Highlight};
        }
        :host(.checked:not(.disabled):hover) .control,
        :host(.checked:not(.disabled):active) .control {
          background: ${SystemColors.HighlightText};
          border-color: ${SystemColors.Highlight};
        }
        :host(.checked) slot[name='checked-indicator'],
        :host(.checked) slot[name='indeterminate-indicator'] {
          fill: ${SystemColors.HighlightText};
        }
        :host(.checked:hover ) .control slot[name='checked-indicator'],
        :host(.checked:hover ) .control slot[name='indeterminate-indicator'] {
          fill: ${SystemColors.Highlight};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) .control {
          border-color: ${SystemColors.GrayText};
          background: ${SystemColors.Field};
        }
        :host(.disabled) slot[name='checked-indicator'],
        :host(.checked.disabled:hover) .control slot[name='checked-indicator'],
        :host(.disabled) slot[name='indeterminate-indicator'],
        :host(.checked.disabled:hover) .control slot[name='indeterminate-indicator'] {
          fill: ${SystemColors.GrayText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/checkbox/index.js
var fluentCheckbox = Checkbox.compose({
  baseName: "checkbox",
  template: checkboxTemplate,
  styles: checkboxStyles,
  checkedIndicator: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>
    </svg>
  `,
  indeterminateIndicator: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8c0-.28.22-.5.5-.5h9a.5.5 0 010 1h-9A.5.5 0 013 8z"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/select/select.styles.js
var logicalControlSelector = ".control";
var interactivitySelector3 = ":not([disabled]):not([open])";
var nonInteractivitySelector2 = "[disabled]";
var baseSelectStyles = (context, definition) => css2`
    ${display("inline-flex")}
    
    :host {
      border-radius: calc(${controlCornerRadius} * 1px);
      box-sizing: border-box;
      color: ${neutralForegroundRest};
      fill: currentcolor;
      font-family: ${bodyFont};
      position: relative;
      user-select: none;
      min-width: 250px;
      vertical-align: top;
    }

    .listbox {
      box-shadow: ${elevationShadowFlyout};
      background: ${fillColor};
      border-radius: calc(${layerCornerRadius} * 1px);
      box-sizing: border-box;
      display: inline-flex;
      flex-direction: column;
      left: 0;
      max-height: calc(var(--max-height) - (${heightNumber} * 1px));
      padding: calc((${designUnit} - ${strokeWidth} ) * 1px);
      overflow-y: auto;
      position: absolute;
      width: 100%;
      z-index: 1;
      margin: 1px 0;
      border: calc(${strokeWidth} * 1px) solid transparent;
    }

    .listbox[hidden] {
      display: none;
    }

    .control {
      border: calc(${strokeWidth} * 1px) solid transparent;
      border-radius: calc(${controlCornerRadius} * 1px);
      height: calc(${heightNumber} * 1px);
      align-items: center;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      ${typeRampBase}
      min-height: 100%;
      padding: 0 calc(${designUnit} * 2.25px);
      width: 100%;
    }

    :host(:${focusVisible}) {
      ${focusTreatmentBase}
    }

    :host([disabled]) .control {
      cursor: ${disabledCursor};
      opacity: ${disabledOpacity};
      user-select: none;
    }

    :host([open][position='above']) .listbox {
      bottom: calc((${heightNumber} + ${designUnit} * 2) * 1px);
    }

    :host([open][position='below']) .listbox {
      top: calc((${heightNumber} + ${designUnit} * 2) * 1px);
    }

    .selected-value {
      font-family: inherit;
      flex: 1 1 auto;
      text-align: start;
    }

    .indicator {
      flex: 0 0 auto;
      margin-inline-start: 1em;
    }

    slot[name='listbox'] {
      display: none;
      width: 100%;
    }

    :host([open]) slot[name='listbox'] {
      display: flex;
      position: absolute;
    }

    .start {
      margin-inline-end: 11px;
    }

    .end {
      margin-inline-start: 11px;
    }

    .start,
    .end,
    .indicator,
    ::slotted(svg) {
      display: flex;
    }

    ::slotted([role='option']) {
      flex: 0 0 auto;
    }
  `;
var baseSelectForcedColorStyles = (context, definition) => css2`
    :host([open]) .listbox {
      background: ${SystemColors.ButtonFace};
      border-color: ${SystemColors.CanvasText};
    }
  `;
var selectStyles = (context, definition) => baseSelectStyles(context, definition).withBehaviors(appearanceBehavior("outline", NeutralButtonStyles(context, definition, interactivitySelector3, nonInteractivitySelector2)), appearanceBehavior("filled", inputFilledStyles(context, definition, logicalControlSelector, interactivitySelector3).withBehaviors(forcedColorsStylesheetBehavior(inputForcedColorStyles(context, definition, logicalControlSelector, interactivitySelector3)))), appearanceBehavior("stealth", StealthButtonStyles(context, definition, interactivitySelector3, nonInteractivitySelector2)), forcedColorsStylesheetBehavior(baseSelectForcedColorStyles(context, definition)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/combobox/combobox.styles.js
var logicalControlSelector2 = ".control";
var interactivitySelector4 = ":not([disabled]):not([open])";
var comboboxStyles = (context, definition) => css2`
    ${baseSelectStyles(context, definition)}

    ${inputStateStyles(context, definition, logicalControlSelector2)}

    :host(:empty) .listbox {
      display: none;
    }

    :host([disabled]) *,
    :host([disabled]) {
      cursor: ${disabledCursor};
      user-select: none;
    }

    :host(:active) .selected-value {
      user-select: none;
    }

    .selected-value {
      -webkit-appearance: none;
      background: transparent;
      border: none;
      color: inherit;
      ${typeRampBase}
      height: calc(100% - ${strokeWidth} * 1px));
      margin: auto 0;
      width: 100%;
      outline: none;
    }
  `.withBehaviors(appearanceBehavior("outline", inputOutlineStyles(context, definition, logicalControlSelector2, interactivitySelector4)), appearanceBehavior("filled", inputFilledStyles(context, definition, logicalControlSelector2, interactivitySelector4)), forcedColorsStylesheetBehavior(inputForcedColorStyles(context, definition, logicalControlSelector2, interactivitySelector4)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/combobox/index.js
var Combobox2 = class extends Combobox {
  /**
   * @internal
   */
  appearanceChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.classList.add(newValue);
      this.classList.remove(oldValue);
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.appearance) {
      this.appearance = "outline";
    }
    if (this.listbox) {
      fillColor.setValueFor(this.listbox, neutralLayerFloating2);
    }
  }
};
__decorate2([
  attr({ mode: "fromView" })
], Combobox2.prototype, "appearance", void 0);
var fluentCombobox = Combobox2.compose({
  baseName: "combobox",
  baseClass: Combobox,
  shadowOptions: {
    delegatesFocus: true
  },
  template: comboboxTemplate,
  styles: comboboxStyles,
  indicator: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/data-grid/data-grid.styles.js
var dataGridStyles = (context, definition) => css2`
  :host {
    display: flex;
    position: relative;
    flex-direction: column;
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/data-grid/data-grid-row.styles.js
var dataGridRowStyles = (context, definition) => css2`
    :host {
      display: grid;
      padding: 1px 0;
      box-sizing: border-box;
      width: 100%;
      border-bottom: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
    }

    :host(.header) {
    }

    :host(.sticky-header) {
      background: ${fillColor};
      position: sticky;
      top: 0;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host {
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/data-grid/data-grid-cell.styles.js
var dataGridCellStyles = (context, definition) => css2`
    :host {
      padding: calc((${designUnit} + ${focusStrokeWidth} - ${strokeWidth}) * 1px) calc(((${designUnit} * 3) + ${focusStrokeWidth} - ${strokeWidth}) * 1px);
      color: ${neutralForegroundRest};
      box-sizing: border-box;
      ${typeRampBase}
      border: transparent calc(${strokeWidth} * 1px) solid;
      overflow: hidden;
      white-space: nowrap;
      border-radius: calc(${controlCornerRadius} * 1px);
    }

    :host(.column-header) {
      font-weight: 600;
    }

    :host(:${focusVisible}) {
      ${focusTreatmentBase}
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host {
          forced-color-adjust: none;
          background: ${SystemColors.Field};
          color: ${SystemColors.FieldText};
        }

        :host(:${focusVisible}) {
          outline-color: ${SystemColors.FieldText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/data-grid/index.js
var fluentDataGridCell = DataGridCell.compose({
  baseName: "data-grid-cell",
  template: dataGridCellTemplate,
  styles: dataGridCellStyles
});
var fluentDataGridRow = DataGridRow.compose({
  baseName: "data-grid-row",
  template: dataGridRowTemplate,
  styles: dataGridRowStyles
});
var fluentDataGrid = DataGrid.compose({
  baseName: "data-grid",
  template: dataGridTemplate,
  styles: dataGridStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/design-system-provider/index.js
var swatchConverter = {
  toView(value) {
    if (value === null || value === void 0) {
      return null;
    }
    return value === null || value === void 0 ? void 0 : value.toColorString();
  },
  fromView(value) {
    if (value === null || value === void 0) {
      return null;
    }
    const color = parseColorHexRGB(value);
    return color ? SwatchRGB.create(color.r, color.g, color.b) : null;
  }
};
var backgroundStyles = css2`
  :host {
    background-color: ${fillColor};
    color: ${neutralForegroundRest};
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css2`
      :host {
        background-color: ${SystemColors.Canvas};
        box-shadow: 0 0 0 1px ${SystemColors.CanvasText};
        color: ${SystemColors.CanvasText};
      }
    `));
function designToken(token) {
  return (source, key) => {
    source[key + "Changed"] = function(prev, next) {
      if (next !== void 0 && next !== null) {
        token.setValueFor(this, next);
      } else {
        token.deleteValueFor(this);
      }
    };
  };
}
var DesignSystemProvider = class extends FoundationElement {
  constructor() {
    super();
    this.noPaint = false;
    const subscriber = {
      handleChange: this.noPaintChanged.bind(this)
    };
    Observable.getNotifier(this).subscribe(subscriber, "fillColor");
    Observable.getNotifier(this).subscribe(subscriber, "baseLayerLuminance");
  }
  connectedCallback() {
    super.connectedCallback();
    this.noPaintChanged();
  }
  noPaintChanged() {
    if (!this.noPaint && (this.fillColor !== void 0 || this.baseLayerLuminance)) {
      this.$fastController.addStyles(backgroundStyles);
    } else {
      this.$fastController.removeStyles(backgroundStyles);
    }
  }
};
__decorate2([
  attr({ attribute: "no-paint", mode: "boolean" })
], DesignSystemProvider.prototype, "noPaint", void 0);
__decorate2([
  attr({
    attribute: "fill-color",
    converter: swatchConverter,
    mode: "fromView"
  }),
  designToken(fillColor)
], DesignSystemProvider.prototype, "fillColor", void 0);
__decorate2([
  attr({
    attribute: "accent-base-color",
    converter: swatchConverter,
    mode: "fromView"
  }),
  designToken(accentBaseColor)
], DesignSystemProvider.prototype, "accentBaseColor", void 0);
__decorate2([
  attr({
    attribute: "neutral-base-color",
    converter: swatchConverter,
    mode: "fromView"
  }),
  designToken(neutralBaseColor)
], DesignSystemProvider.prototype, "neutralBaseColor", void 0);
__decorate2([
  attr({
    converter: nullableNumberConverter
  }),
  designToken(density)
], DesignSystemProvider.prototype, "density", void 0);
__decorate2([
  attr({
    attribute: "design-unit",
    converter: nullableNumberConverter
  }),
  designToken(designUnit)
], DesignSystemProvider.prototype, "designUnit", void 0);
__decorate2([
  attr({
    attribute: "direction"
  }),
  designToken(direction)
], DesignSystemProvider.prototype, "direction", void 0);
__decorate2([
  attr({
    attribute: "base-height-multiplier",
    converter: nullableNumberConverter
  }),
  designToken(baseHeightMultiplier)
], DesignSystemProvider.prototype, "baseHeightMultiplier", void 0);
__decorate2([
  attr({
    attribute: "base-horizontal-spacing-multiplier",
    converter: nullableNumberConverter
  }),
  designToken(baseHorizontalSpacingMultiplier)
], DesignSystemProvider.prototype, "baseHorizontalSpacingMultiplier", void 0);
__decorate2([
  attr({
    attribute: "control-corner-radius",
    converter: nullableNumberConverter
  }),
  designToken(controlCornerRadius)
], DesignSystemProvider.prototype, "controlCornerRadius", void 0);
__decorate2([
  attr({
    attribute: "layer-corner-radius",
    converter: nullableNumberConverter
  }),
  designToken(layerCornerRadius)
], DesignSystemProvider.prototype, "layerCornerRadius", void 0);
__decorate2([
  attr({
    attribute: "stroke-width",
    converter: nullableNumberConverter
  }),
  designToken(strokeWidth)
], DesignSystemProvider.prototype, "strokeWidth", void 0);
__decorate2([
  attr({
    attribute: "focus-stroke-width",
    converter: nullableNumberConverter
  }),
  designToken(focusStrokeWidth)
], DesignSystemProvider.prototype, "focusStrokeWidth", void 0);
__decorate2([
  attr({
    attribute: "disabled-opacity",
    converter: nullableNumberConverter
  }),
  designToken(disabledOpacity)
], DesignSystemProvider.prototype, "disabledOpacity", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-minus-2-font-size"
  }),
  designToken(typeRampMinus2FontSize)
], DesignSystemProvider.prototype, "typeRampMinus2FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-minus-2-line-height"
  }),
  designToken(typeRampMinus2LineHeight)
], DesignSystemProvider.prototype, "typeRampMinus2LineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-minus-1-font-size"
  }),
  designToken(typeRampMinus1FontSize)
], DesignSystemProvider.prototype, "typeRampMinus1FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-minus-1-line-height"
  }),
  designToken(typeRampMinus1LineHeight)
], DesignSystemProvider.prototype, "typeRampMinus1LineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-base-font-size"
  }),
  designToken(typeRampBaseFontSize)
], DesignSystemProvider.prototype, "typeRampBaseFontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-base-line-height"
  }),
  designToken(typeRampBaseLineHeight)
], DesignSystemProvider.prototype, "typeRampBaseLineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-1-font-size"
  }),
  designToken(typeRampPlus1FontSize)
], DesignSystemProvider.prototype, "typeRampPlus1FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-1-line-height"
  }),
  designToken(typeRampPlus1LineHeight)
], DesignSystemProvider.prototype, "typeRampPlus1LineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-2-font-size"
  }),
  designToken(typeRampPlus2FontSize)
], DesignSystemProvider.prototype, "typeRampPlus2FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-2-line-height"
  }),
  designToken(typeRampPlus2LineHeight)
], DesignSystemProvider.prototype, "typeRampPlus2LineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-3-font-size"
  }),
  designToken(typeRampPlus3FontSize)
], DesignSystemProvider.prototype, "typeRampPlus3FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-3-line-height"
  }),
  designToken(typeRampPlus3LineHeight)
], DesignSystemProvider.prototype, "typeRampPlus3LineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-4-font-size"
  }),
  designToken(typeRampPlus4FontSize)
], DesignSystemProvider.prototype, "typeRampPlus4FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-4-line-height"
  }),
  designToken(typeRampPlus4LineHeight)
], DesignSystemProvider.prototype, "typeRampPlus4LineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-5-font-size"
  }),
  designToken(typeRampPlus5FontSize)
], DesignSystemProvider.prototype, "typeRampPlus5FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-5-line-height"
  }),
  designToken(typeRampPlus5LineHeight)
], DesignSystemProvider.prototype, "typeRampPlus5LineHeight", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-6-font-size"
  }),
  designToken(typeRampPlus6FontSize)
], DesignSystemProvider.prototype, "typeRampPlus6FontSize", void 0);
__decorate2([
  attr({
    attribute: "type-ramp-plus-6-line-height"
  }),
  designToken(typeRampPlus6LineHeight)
], DesignSystemProvider.prototype, "typeRampPlus6LineHeight", void 0);
__decorate2([
  attr({
    attribute: "accent-fill-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentFillRestDelta)
], DesignSystemProvider.prototype, "accentFillRestDelta", void 0);
__decorate2([
  attr({
    attribute: "accent-fill-hover-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentFillHoverDelta)
], DesignSystemProvider.prototype, "accentFillHoverDelta", void 0);
__decorate2([
  attr({
    attribute: "accent-fill-active-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentFillActiveDelta)
], DesignSystemProvider.prototype, "accentFillActiveDelta", void 0);
__decorate2([
  attr({
    attribute: "accent-fill-focus-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentFillFocusDelta)
], DesignSystemProvider.prototype, "accentFillFocusDelta", void 0);
__decorate2([
  attr({
    attribute: "accent-foreground-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentForegroundRestDelta)
], DesignSystemProvider.prototype, "accentForegroundRestDelta", void 0);
__decorate2([
  attr({
    attribute: "accent-foreground-hover-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentForegroundHoverDelta)
], DesignSystemProvider.prototype, "accentForegroundHoverDelta", void 0);
__decorate2([
  attr({
    attribute: "accent-foreground-active-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentForegroundActiveDelta)
], DesignSystemProvider.prototype, "accentForegroundActiveDelta", void 0);
__decorate2([
  attr({
    attribute: "accent-foreground-focus-delta",
    converter: nullableNumberConverter
  }),
  designToken(accentForegroundFocusDelta)
], DesignSystemProvider.prototype, "accentForegroundFocusDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillRestDelta)
], DesignSystemProvider.prototype, "neutralFillRestDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-hover-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillHoverDelta)
], DesignSystemProvider.prototype, "neutralFillHoverDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-active-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillActiveDelta)
], DesignSystemProvider.prototype, "neutralFillActiveDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-focus-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillFocusDelta)
], DesignSystemProvider.prototype, "neutralFillFocusDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-input-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillInputRestDelta)
], DesignSystemProvider.prototype, "neutralFillInputRestDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-input-hover-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillInputHoverDelta)
], DesignSystemProvider.prototype, "neutralFillInputHoverDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-input-active-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillInputActiveDelta)
], DesignSystemProvider.prototype, "neutralFillInputActiveDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-input-focus-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillInputFocusDelta)
], DesignSystemProvider.prototype, "neutralFillInputFocusDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-layer-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillLayerRestDelta)
], DesignSystemProvider.prototype, "neutralFillLayerRestDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-stealth-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillStealthRestDelta)
], DesignSystemProvider.prototype, "neutralFillStealthRestDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-stealth-hover-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillStealthHoverDelta)
], DesignSystemProvider.prototype, "neutralFillStealthHoverDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-stealth-active-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillStealthActiveDelta)
], DesignSystemProvider.prototype, "neutralFillStealthActiveDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-stealth-focus-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillStealthFocusDelta)
], DesignSystemProvider.prototype, "neutralFillStealthFocusDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-strong-hover-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillStrongHoverDelta)
], DesignSystemProvider.prototype, "neutralFillStrongHoverDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-strong-active-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillStrongActiveDelta)
], DesignSystemProvider.prototype, "neutralFillStrongActiveDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-fill-strong-focus-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralFillStrongFocusDelta)
], DesignSystemProvider.prototype, "neutralFillStrongFocusDelta", void 0);
__decorate2([
  attr({
    attribute: "base-layer-luminance",
    converter: nullableNumberConverter
  }),
  designToken(baseLayerLuminance)
], DesignSystemProvider.prototype, "baseLayerLuminance", void 0);
__decorate2([
  attr({
    attribute: "neutral-stroke-divider-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralStrokeDividerRestDelta)
], DesignSystemProvider.prototype, "neutralStrokeDividerRestDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-stroke-rest-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralStrokeRestDelta)
], DesignSystemProvider.prototype, "neutralStrokeRestDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-stroke-hover-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralStrokeHoverDelta)
], DesignSystemProvider.prototype, "neutralStrokeHoverDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-stroke-active-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralStrokeActiveDelta)
], DesignSystemProvider.prototype, "neutralStrokeActiveDelta", void 0);
__decorate2([
  attr({
    attribute: "neutral-stroke-focus-delta",
    converter: nullableNumberConverter
  }),
  designToken(neutralStrokeFocusDelta)
], DesignSystemProvider.prototype, "neutralStrokeFocusDelta", void 0);
var fluentDesignSystemProvider = DesignSystemProvider.compose({
  baseName: "design-system-provider",
  template: html2` <slot></slot> `,
  styles: css2`
    ${display("block")}
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/dialog/dialog.styles.js
var dialogStyles = (context, definition) => css2`
  :host([hidden]) {
    display: none;
  }

  :host {
    --dialog-height: 480px;
    --dialog-width: 640px;
    display: block;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    touch-action: none;
  }

  .positioning-region {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }

  .control {
    box-shadow: ${elevationShadowDialog};
    margin-top: auto;
    margin-bottom: auto;
    border-radius: calc(${layerCornerRadius} * 1px);
    width: var(--dialog-width);
    height: var(--dialog-height);
    background: ${fillColor};
    z-index: 1;
    border: calc(${strokeWidth} * 1px) solid transparent;
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/dialog/index.js
var fluentDialog = Dialog.compose({
  baseName: "dialog",
  template: dialogTemplate,
  styles: dialogStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/divider/divider.styles.js
var dividerStyles = (context, definition) => css2`
    ${display("block")} :host {
      box-sizing: content-box;
      height: 0;
      border: none;
      border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
    }

    :host([orientation="vertical"]) {
      border: none;
      height: 100%;
      margin: 0 calc(${designUnit} * 1px);
      border-left: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
  }
  `;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/divider/index.js
var fluentDivider = Divider.compose({
  baseName: "divider",
  template: dividerTemplate,
  styles: dividerStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/flipper/flipper.styles.js
var flipperStyles = (context, definition) => css2`
    ${display("inline-flex")} :host {
      height: calc((${heightNumber} + ${designUnit}) * 1px);
      justify-content: center;
      align-items: center;
      fill: currentcolor;
      color: ${neutralFillStrongRest};
      background: padding-box linear-gradient(${neutralFillRest}, ${neutralFillRest}),
        border-box ${neutralStrokeControlRest};
      box-sizing: border-box;
      border: calc(${strokeWidth} * 1px) solid transparent;
      border-radius: calc(${controlCornerRadius} * 1px);
      padding: 0;
    }

    :host(.disabled) {
      opacity: ${disabledOpacity};
      cursor: ${disabledCursor};
      pointer-events: none;
    }

    .next,
    .previous {
      display: flex;
    }

    :host(:not(.disabled):hover) {
      cursor: pointer;
    }

    :host(:not(.disabled):hover) {
      color: ${neutralFillStrongHover};
    }

    :host(:not(.disabled):active) {
      color: ${neutralFillStrongActive};
    }

    :host(:${focusVisible}) {
      ${focusTreatmentBase}
    }

    :host::-moz-focus-inner {
      border: 0;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host {
          background: ${SystemColors.ButtonFace};
          border-color: ${SystemColors.ButtonText};
        }
        :host .next,
        :host .previous {
          color: ${SystemColors.ButtonText};
          fill: currentcolor;
        }
        :host(:not(.disabled):hover) {
          background: ${SystemColors.Highlight};
        }
        :host(:not(.disabled):hover) .next,
        :host(:not(.disabled):hover) .previous {
          color: ${SystemColors.HighlightText};
          fill: currentcolor;
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled),
        :host(.disabled) .next,
        :host(.disabled) .previous {
          border-color: ${SystemColors.GrayText};
          color: ${SystemColors.GrayText};
          fill: currentcolor;
        }
        :host(:${focusVisible}) {
          forced-color-adjust: none;
          outline-color: ${SystemColors.Highlight};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/flipper/index.js
var fluentFlipper = Flipper.compose({
  baseName: "flipper",
  template: flipperTemplate,
  styles: flipperStyles,
  next: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.57 11.84A1 1 0 016 11.02V4.98a1 1 0 011.57-.82l3.79 2.62c.85.59.85 1.85 0 2.44l-3.79 2.62z"/>
    </svg>
  `,
  previous: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.43 11.84a1 1 0 001.57-.82V4.98a1 1 0 00-1.57-.82L5.64 6.78c-.85.59-.85 1.85 0 2.44l3.79 2.62z"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/horizontal-scroll/horizontal-scroll.styles.js
var ltrActionsStyles = css2`
  .scroll-prev {
    right: auto;
    left: 0;
  }

  .scroll.scroll-next::before,
  .scroll-next .scroll-action {
    left: auto;
    right: 0;
  }

  .scroll.scroll-next::before {
    background: linear-gradient(to right, transparent, var(--scroll-fade-next));
  }

  .scroll-next .scroll-action {
    transform: translate(50%, -50%);
  }
`;
var rtlActionsStyles = css2`
  .scroll.scroll-next {
    right: auto;
    left: 0;
  }

  .scroll.scroll-next::before {
    background: linear-gradient(to right, var(--scroll-fade-next), transparent);
    left: auto;
    right: 0;
  }

  .scroll.scroll-prev::before {
    background: linear-gradient(to right, transparent, var(--scroll-fade-previous));
  }

  .scroll-prev .scroll-action {
    left: auto;
    right: 0;
    transform: translate(50%, -50%);
  }
`;
var ActionsStyles = css2`
  .scroll-area {
    position: relative;
  }

  div.scroll-view {
    overflow-x: hidden;
  }

  .scroll {
    bottom: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    user-select: none;
    width: 100px;
  }

  .scroll.disabled {
    display: none;
  }

  .scroll::before,
  .scroll-action {
    left: 0;
    position: absolute;
  }

  .scroll::before {
    background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
    content: '';
    display: block;
    height: 100%;
    width: 100%;
  }

  .scroll-action {
    pointer-events: auto;
    right: auto;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  ::slotted(fluent-flipper) {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .scroll-area:hover ::slotted(fluent-flipper) {
    opacity: 1;
  }
`.withBehaviors(new DirectionalStyleSheetBehavior(ltrActionsStyles, rtlActionsStyles));
var horizontalScrollStyles = (context, definition) => css2`
  ${display("block")} :host {
    --scroll-align: center;
    --scroll-item-spacing: 4px;
    contain: layout;
    position: relative;
  }

  .scroll-view {
    overflow-x: auto;
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .content-container {
    align-items: var(--scroll-align);
    display: inline-flex;
    flex-wrap: nowrap;
    position: relative;
  }

  .content-container ::slotted(*) {
    margin-right: var(--scroll-item-spacing);
  }

  .content-container ::slotted(*:last-child) {
    margin-right: 0;
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/horizontal-scroll/index.js
var HorizontalScroll2 = class extends HorizontalScroll {
  /**
   * @public
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.view !== "mobile") {
      this.$fastController.addStyles(ActionsStyles);
    }
  }
};
var fluentHorizontalScroll = HorizontalScroll2.compose({
  baseName: "horizontal-scroll",
  baseClass: HorizontalScroll,
  template: horizontalScrollTemplate,
  styles: horizontalScrollStyles,
  nextFlipper: html2`
    <fluent-flipper @click="${(x) => x.scrollToNext()}" aria-hidden="${(x) => x.flippersHiddenFromAT}"></fluent-flipper>
  `,
  previousFlipper: html2`
    <fluent-flipper
      @click="${(x) => x.scrollToPrevious()}"
      direction="previous"
      aria-hidden="${(x) => x.flippersHiddenFromAT}"
    ></fluent-flipper>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/listbox/listbox.styles.js
var listboxStyles = (context, definition) => css2`
    ${display("inline-flex")} :host {
      border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
      border-radius: calc(${controlCornerRadius} * 1px);
      box-sizing: border-box;
      flex-direction: column;
      padding: calc(${designUnit} * 1px) 0;
    }

    ::slotted(${context.tagFor(ListboxOption)}) {
      margin: 0 calc(${designUnit} * 1px);
    }

    :host(:focus-within:not([disabled])) {
      ${focusTreatmentBase}
    }
  `;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/listbox/index.js
var Listbox2 = class extends Listbox {
};
var fluentListbox = Listbox2.compose({
  baseName: "listbox",
  template: listboxTemplate,
  styles: listboxStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/listbox-option/listbox-option.styles.js
var optionStyles = (context, definition) => css2`
    ${display("inline-flex")} :host {
      position: relative;
      ${typeRampBase}
      background: ${neutralFillStealthRest};
      border-radius: calc(${controlCornerRadius} * 1px);
      border: calc(${strokeWidth} * 1px) solid transparent;
      box-sizing: border-box;
      color: ${neutralForegroundRest};
      cursor: pointer;
      fill: currentcolor;
      height: calc(${heightNumber} * 1px);
      overflow: hidden;
      align-items: center;
      padding: 0 calc(((${designUnit} * 3) - ${strokeWidth} - 1) * 1px);
      user-select: none;
      white-space: nowrap;
    }

    :host::before {
      content: '';
      display: block;
      position: absolute;
      left: calc((${focusStrokeWidth} - ${strokeWidth}) * 1px);
      top: calc((${heightNumber} / 4) - ${focusStrokeWidth} * 1px);
      width: 3px;
      height: calc((${heightNumber} / 2) * 1px);
      background: transparent;
      border-radius: calc(${controlCornerRadius} * 1px);
    }

    :host(:not([disabled]):hover) {
      background: ${neutralFillStealthHover};
    }

    :host(:not([disabled]):active) {
      background: ${neutralFillStealthActive};
    }

    :host(:not([disabled]):active)::before {
      background: ${accentFillRest};
      height: calc(((${heightNumber} / 2) - 6) * 1px);
    }

    :host([aria-selected='true'])::before {
      background: ${accentFillRest};
    }

    :host(:${focusVisible}) {
      ${focusTreatmentBase}
      background: ${neutralFillStealthFocus};
    }

    :host([aria-selected='true']) {
      background: ${neutralFillSecondaryRest};
    }

    :host(:not([disabled])[aria-selected='true']:hover) {
      background: ${neutralFillSecondaryHover};
    }

    :host(:not([disabled])[aria-selected='true']:active) {
      background: ${neutralFillSecondaryActive};
    }

    :host(:not([disabled]):not([aria-selected='true']):hover) {
      background: ${neutralFillStealthHover};
    }

    :host(:not([disabled]):not([aria-selected='true']):active) {
      background: ${neutralFillStealthActive};
    }

    :host([disabled]) {
      cursor: ${disabledCursor};
      opacity: ${disabledOpacity};
    }

    .content {
      grid-column-start: 2;
      justify-self: start;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .start,
    .end,
    ::slotted(svg) {
      display: flex;
    }

    ::slotted([slot='end']) {
      margin-inline-start: 1ch;
    }

    ::slotted([slot='start']) {
      margin-inline-end: 1ch;
    }
  `.withBehaviors(new DirectionalStyleSheetBehavior(null, css2`
      :host::before {
        right: calc((${focusStrokeWidth} - ${strokeWidth}) * 1px);
      }
    `), forcedColorsStylesheetBehavior(css2`
        :host {
          background: ${SystemColors.ButtonFace};
          border-color: ${SystemColors.ButtonFace};
          color: ${SystemColors.ButtonText};
        }
        :host(:not([disabled]):not([aria-selected="true"]):hover),
        :host(:not([disabled])[aria-selected="true"]:hover),
        :host([aria-selected="true"]) {
          forced-color-adjust: none;
          background: ${SystemColors.Highlight};
          color: ${SystemColors.HighlightText};
        }
        :host(:not([disabled]):active)::before,
        :host([aria-selected='true'])::before {
          background: ${SystemColors.HighlightText};
        }
        :host([disabled]),
        :host([disabled]:not([aria-selected='true']):hover) {
          background: ${SystemColors.Canvas};
          color: ${SystemColors.GrayText};
          fill: currentcolor;
          opacity: 1;
        }
        :host(:${focusVisible}) {
          outline-color: ${SystemColors.CanvasText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/listbox-option/index.js
var fluentOption = ListboxOption.compose({
  baseName: "option",
  template: listboxOptionTemplate,
  styles: optionStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/menu/menu.styles.js
var menuStyles = (context, definition) => css2`
    ${display("block")} :host {
      background: ${neutralLayerFloating2};
      border: calc(${strokeWidth} * 1px) solid transparent;
      border-radius: calc(${layerCornerRadius} * 1px);
      box-shadow: ${elevationShadowFlyout};
      padding: calc((${designUnit} - ${strokeWidth}) * 1px) 0;
      max-width: 368px;
      min-width: 64px;
    }

    :host([slot='submenu']) {
      width: max-content;
      margin: 0 calc(${designUnit} * 2px);
    }

    ::slotted(${context.tagFor(MenuItem)}) {
      margin: 0 calc(${designUnit} * 1px);
    }

    ::slotted(${context.tagFor(Divider)}) {
      margin: calc(${designUnit} * 1px) 0;
    }

    ::slotted(hr) {
      box-sizing: content-box;
      height: 0;
      margin: calc(${designUnit} * 1px) 0;
      border: none;
      border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host([slot='submenu']) {
          background: ${SystemColors.Canvas};
          border-color: ${SystemColors.CanvasText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/menu/index.js
var Menu2 = class extends Menu {
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    fillColor.setValueFor(this, neutralLayerFloating2);
  }
};
var fluentMenu = Menu2.compose({
  baseName: "menu",
  baseClass: Menu,
  template: menuTemplate,
  styles: menuStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/menu-item/menu-item.styles.js
var menuItemStyles = (context, definition) => css2`
    ${display("grid")} :host {
      contain: layout;
      overflow: visible;
      ${typeRampBase}
      box-sizing: border-box;
      height: calc(${heightNumber} * 1px);
      grid-template-columns: minmax(32px, auto) 1fr minmax(32px, auto);
      grid-template-rows: auto;
      justify-items: center;
      align-items: center;
      padding: 0;
      white-space: nowrap;
      color: ${neutralForegroundRest};
      fill: currentcolor;
      cursor: pointer;
      border-radius: calc(${controlCornerRadius} * 1px);
      border: calc(${strokeWidth} * 1px) solid transparent;
      position: relative;
    }

    :host(.indent-0) {
      grid-template-columns: auto 1fr minmax(32px, auto);
    }

    :host(.indent-0) .content {
      grid-column: 1;
      grid-row: 1;
      margin-inline-start: 10px;
    }

    :host(.indent-0) .expand-collapse-glyph-container {
      grid-column: 5;
      grid-row: 1;
    }

    :host(.indent-2) {
      grid-template-columns: minmax(32px, auto) minmax(32px, auto) 1fr minmax(32px, auto) minmax(32px, auto);
    }

    :host(.indent-2) .content {
      grid-column: 3;
      grid-row: 1;
      margin-inline-start: 10px;
    }

    :host(.indent-2) .expand-collapse-glyph-container {
      grid-column: 5;
      grid-row: 1;
    }

    :host(.indent-2) .start {
      grid-column: 2;
    }

    :host(.indent-2) .end {
      grid-column: 4;
    }

    :host(:${focusVisible}) {
      ${focusTreatmentBase}
    }

    :host(:not([disabled]):hover) {
      background: ${neutralFillStealthHover};
    }

    :host(:not([disabled]):active),
    :host(.expanded) {
      background: ${neutralFillStealthActive};
      color: ${neutralForegroundRest};
      z-index: 2;
    }

    :host([disabled]) {
      cursor: ${disabledCursor};
      opacity: ${disabledOpacity};
    }

    .content {
      grid-column-start: 2;
      justify-self: start;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .start,
    .end {
      display: flex;
      justify-content: center;
    }

    :host(.indent-0[aria-haspopup='menu']) {
      display: grid;
      grid-template-columns: minmax(32px, auto) auto 1fr minmax(32px, auto) minmax(32px, auto);
      align-items: center;
      min-height: 32px;
    }

    :host(.indent-1[aria-haspopup='menu']),
    :host(.indent-1[role='menuitemcheckbox']),
    :host(.indent-1[role='menuitemradio']) {
      display: grid;
      grid-template-columns: minmax(32px, auto) auto 1fr minmax(32px, auto) minmax(32px, auto);
      align-items: center;
      min-height: 32px;
    }

    :host(.indent-2:not([aria-haspopup='menu'])) .end {
      grid-column: 5;
    }

    :host .input-container,
    :host .expand-collapse-glyph-container {
      display: none;
    }

    :host([aria-haspopup='menu']) .expand-collapse-glyph-container,
    :host([role='menuitemcheckbox']) .input-container,
    :host([role='menuitemradio']) .input-container {
      display: grid;
    }

    :host([aria-haspopup='menu']) .content,
    :host([role='menuitemcheckbox']) .content,
    :host([role='menuitemradio']) .content {
      grid-column-start: 3;
    }

    :host([aria-haspopup='menu'].indent-0) .content {
      grid-column-start: 1;
    }

    :host([aria-haspopup='menu']) .end,
    :host([role='menuitemcheckbox']) .end,
    :host([role='menuitemradio']) .end {
      grid-column-start: 4;
    }

    :host .expand-collapse,
    :host .checkbox,
    :host .radio {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-sizing: border-box;
    }

    :host .checkbox-indicator,
    :host .radio-indicator,
    slot[name='checkbox-indicator'],
    slot[name='radio-indicator'] {
      display: none;
    }

    ::slotted([slot='end']:not(svg)) {
      margin-inline-end: 10px;
      color: ${neutralForegroundHint};
    }

    :host([aria-checked='true']) .checkbox-indicator,
    :host([aria-checked='true']) slot[name='checkbox-indicator'],
    :host([aria-checked='true']) .radio-indicator,
    :host([aria-checked='true']) slot[name='radio-indicator'] {
      display: flex;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host,
        ::slotted([slot='end']:not(svg)) {
          forced-color-adjust: none;
          color: ${SystemColors.ButtonText};
          fill: currentcolor;
        }
        :host(:not([disabled]):hover) {
          background: ${SystemColors.Highlight};
          color: ${SystemColors.HighlightText};
          fill: currentcolor;
        }
        :host(:hover) .start,
        :host(:hover) .end,
        :host(:hover)::slotted(svg),
        :host(:active) .start,
        :host(:active) .end,
        :host(:active)::slotted(svg),
        :host(:hover) ::slotted([slot='end']:not(svg)),
        :host(:${focusVisible}) ::slotted([slot='end']:not(svg)) {
          color: ${SystemColors.HighlightText};
          fill: currentcolor;
        }
        :host(.expanded) {
          background: ${SystemColors.Highlight};
          color: ${SystemColors.HighlightText};
        }
        :host(:${focusVisible}) {
          background: ${SystemColors.Highlight};
          outline-color: ${SystemColors.ButtonText};
          color: ${SystemColors.HighlightText};
          fill: currentcolor;
        }
        :host([disabled]),
        :host([disabled]:hover),
        :host([disabled]:hover) .start,
        :host([disabled]:hover) .end,
        :host([disabled]:hover)::slotted(svg),
        :host([disabled]:${focusVisible}) {
          background: ${SystemColors.ButtonFace};
          color: ${SystemColors.GrayText};
          fill: currentcolor;
          opacity: 1;
        }
        :host([disabled]:${focusVisible}) {
          outline-color: ${SystemColors.GrayText};
        }
        :host .expanded-toggle,
        :host .checkbox,
        :host .radio {
          border-color: ${SystemColors.ButtonText};
          background: ${SystemColors.HighlightText};
        }
        :host([checked]) .checkbox,
        :host([checked]) .radio {
          background: ${SystemColors.HighlightText};
          border-color: ${SystemColors.HighlightText};
        }
        :host(:hover) .expanded-toggle,
            :host(:hover) .checkbox,
            :host(:hover) .radio,
            :host(:${focusVisible}) .expanded-toggle,
            :host(:${focusVisible}) .checkbox,
            :host(:${focusVisible}) .radio,
            :host([checked]:hover) .checkbox,
            :host([checked]:hover) .radio,
            :host([checked]:${focusVisible}) .checkbox,
            :host([checked]:${focusVisible}) .radio {
          border-color: ${SystemColors.HighlightText};
        }
        :host([aria-checked='true']) {
          background: ${SystemColors.Highlight};
          color: ${SystemColors.HighlightText};
        }
        :host([aria-checked='true']) .checkbox-indicator,
        :host([aria-checked='true']) ::slotted([slot='checkbox-indicator']),
        :host([aria-checked='true']) ::slotted([slot='radio-indicator']) {
          fill: ${SystemColors.Highlight};
        }
        :host([aria-checked='true']) .radio-indicator {
          background: ${SystemColors.Highlight};
        }
      `), new DirectionalStyleSheetBehavior(css2`
        .expand-collapse-glyph-container {
          transform: rotate(0deg);
        }
      `, css2`
        .expand-collapse-glyph-container {
          transform: rotate(180deg);
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/menu-item/index.js
var fluentMenuItem = MenuItem.compose({
  baseName: "menu-item",
  template: menuItemTemplate,
  styles: menuItemStyles,
  checkboxIndicator: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>
    </svg>
  `,
  expandCollapseGlyph: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.65 3.15a.5.5 0 000 .7L9.79 8l-4.14 4.15a.5.5 0 00.7.7l4.5-4.5a.5.5 0 000-.7l-4.5-4.5a.5.5 0 00-.7 0z"/>
    </svg>
  `,
  radioIndicator: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/number-field/number-field.styles.js
var logicalControlSelector3 = ".root";
var numberFieldStyles = (context, definition) => css2`
    ${display("inline-block")}

    ${baseInputStyles(context, definition, logicalControlSelector3)}

    ${inputStateStyles(context, definition, logicalControlSelector3)}

    .root {
      display: flex;
      flex-direction: row;
    }

    .control {
      -webkit-appearance: none;
      color: inherit;
      background: transparent;
      border: 0;
      height: calc(100% - 4px);
      margin-top: auto;
      margin-bottom: auto;
      padding: 0 calc(${designUnit} * 2px + 1px);
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }

    .start,
    .end {
      margin: auto;
      fill: currentcolor;
    }

    .start {
      display: flex;
      margin-inline-start: 11px;
    }

    .end {
      display: flex;
      margin-inline-end: 11px;
    }

    .controls {
      opacity: 0;
      position: relative;
      top: -1px;
      z-index: 3;
    }

    :host(:hover:not([disabled])) .controls,
    :host(:focus-within:not([disabled])) .controls {
      opacity: 1;
    }

    .step-up,
    .step-down {
      display: flex;
      padding: 0 8px;
      cursor: pointer;
    }

    .step-up {
      padding-top: 3px;
    }
  `.withBehaviors(appearanceBehavior("outline", inputOutlineStyles(context, definition, logicalControlSelector3)), appearanceBehavior("filled", inputFilledStyles(context, definition, logicalControlSelector3)), forcedColorsStylesheetBehavior(inputForcedColorStyles(context, definition, logicalControlSelector3)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/number-field/index.js
var NumberField2 = class extends NumberField {
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.appearance) {
      this.appearance = "outline";
    }
  }
};
__decorate2([
  attr
], NumberField2.prototype, "appearance", void 0);
var fluentNumberField = NumberField2.compose({
  baseName: "number-field",
  baseClass: NumberField,
  styles: numberFieldStyles,
  template: numberFieldTemplate,
  shadowOptions: {
    delegatesFocus: true
  },
  stepDownGlyph: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `,
  stepUpGlyph: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 7.35c.2.2.5.2.7 0L6 4.21l3.15 3.14a.5.5 0 10.7-.7l-3.5-3.5a.5.5 0 00-.7 0l-3.5 3.5a.5.5 0 000 .7z"/>
    </svg>
`
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/progress/progress/progress.styles.js
var progressStyles = (context, definition) => css2`
    ${display("flex")} :host {
      align-items: center;
      height: calc((${strokeWidth} * 3) * 1px);
    }

    .progress {
      background-color: ${neutralStrokeStrongRest};
      border-radius: calc(${designUnit} * 1px);
      width: 100%;
      height: calc(${strokeWidth} * 1px);
      display: flex;
      align-items: center;
      position: relative;
    }

    .determinate {
      background-color: ${accentFillRest};
      border-radius: calc(${designUnit} * 1px);
      height: calc((${strokeWidth} * 3) * 1px);
      transition: all 0.2s ease-in-out;
      display: flex;
    }

    .indeterminate {
      height: calc((${strokeWidth} * 3) * 1px);
      border-radius: calc(${designUnit} * 1px);
      display: flex;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    .indeterminate-indicator-1 {
      position: absolute;
      opacity: 0;
      height: 100%;
      background-color: ${accentFillRest};
      border-radius: calc(${designUnit} * 1px);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
      width: 40%;
      animation: indeterminate-1 2s infinite;
    }

    .indeterminate-indicator-2 {
      position: absolute;
      opacity: 0;
      height: 100%;
      background-color: ${accentFillRest};
      border-radius: calc(${designUnit} * 1px);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
      width: 60%;
      animation: indeterminate-2 2s infinite;
    }

    :host(.paused) .indeterminate-indicator-1,
    :host(.paused) .indeterminate-indicator-2 {
      animation: none;
      background-color: ${neutralForegroundHint};
      width: 100%;
      opacity: 1;
    }

    :host(.paused) .determinate {
      background-color: ${neutralForegroundHint};
    }

    @keyframes indeterminate-1 {
      0% {
        opacity: 1;
        transform: translateX(-100%);
      }
      70% {
        opacity: 1;
        transform: translateX(300%);
      }
      70.01% {
        opacity: 0;
      }
      100% {
        opacity: 0;
        transform: translateX(300%);
      }
    }

    @keyframes indeterminate-2 {
      0% {
        opacity: 0;
        transform: translateX(-150%);
      }
      29.99% {
        opacity: 0;
      }
      30% {
        opacity: 1;
        transform: translateX(-150%);
      }
      100% {
        transform: translateX(166.66%);
        opacity: 1;
      }
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .indeterminate-indicator-1,
        .indeterminate-indicator-2,
        .determinate,
        .progress {
          background-color: ${SystemColors.ButtonText};
        }
        :host(.paused) .indeterminate-indicator-1,
        :host(.paused) .indeterminate-indicator-2,
        :host(.paused) .determinate {
          background-color: ${SystemColors.GrayText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/progress/progress/index.js
var Progress = class extends BaseProgress {
};
var fluentProgress = Progress.compose({
  baseName: "progress",
  template: progressTemplate,
  styles: progressStyles,
  indeterminateIndicator1: `
    <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
  `,
  indeterminateIndicator2: `
    <span class="indeterminate-indicator-2" part="indeterminate-indicator-2"></span>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/progress/progress-ring/progress-ring.styles.js
var progressRingStyles = (context, definition) => css2`
    ${display("flex")} :host {
      align-items: center;
      height: calc(${heightNumber} * 1px);
      width: calc(${heightNumber} * 1px);
    }

    .progress {
      height: 100%;
      width: 100%;
    }

    .background {
      fill: none;
      stroke-width: 2px;
    }

    .determinate {
      stroke: ${accentFillRest};
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      transform-origin: 50% 50%;
      transform: rotate(-90deg);
      transition: all 0.2s ease-in-out;
    }

    .indeterminate-indicator-1 {
      stroke: ${accentFillRest};
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      transform-origin: 50% 50%;
      transform: rotate(-90deg);
      transition: all 0.2s ease-in-out;
      animation: spin-infinite 2s linear infinite;
    }

    :host(.paused) .indeterminate-indicator-1 {
      animation: none;
      stroke: ${neutralForegroundHint};
    }

    :host(.paused) .determinate {
      stroke: ${neutralForegroundHint};
    }

    @keyframes spin-infinite {
      0% {
        stroke-dasharray: 0.01px 43.97px;
        transform: rotate(0deg);
      }
      50% {
        stroke-dasharray: 21.99px 21.99px;
        transform: rotate(450deg);
      }
      100% {
        stroke-dasharray: 0.01px 43.97px;
        transform: rotate(1080deg);
      }
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .background {
          stroke: ${SystemColors.Field};
        }
        .determinate,
        .indeterminate-indicator-1 {
          stroke: ${SystemColors.ButtonText};
        }
        :host(.paused) .determinate,
        :host(.paused) .indeterminate-indicator-1 {
          stroke: ${SystemColors.GrayText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/progress/progress-ring/index.js
var ProgressRing = class extends BaseProgress {
};
var fluentProgressRing = ProgressRing.compose({
  baseName: "progress-ring",
  template: progressRingTemplate,
  styles: progressRingStyles,
  indeterminateIndicator: `
    <svg class="progress" part="progress" viewBox="0 0 16 16">
        <circle
            class="background"
            part="background"
            cx="8px"
            cy="8px"
            r="7px"
        ></circle>
        <circle
            class="indeterminate-indicator-1"
            part="indeterminate-indicator-1"
            cx="8px"
            cy="8px"
            r="7px"
        ></circle>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/radio/radio.styles.js
var radioStyles = (context, definition) => css2`
    ${display("inline-flex")} :host {
      --input-size: calc((${heightNumber} / 2) + ${designUnit});
      align-items: center;
      outline: none;
      ${/*
 * Chromium likes to select label text or the default slot when
 * the radio button is clicked. Maybe there is a better solution here?
 */
""} user-select: none;
      position: relative;
      flex-direction: row;
      transition: all 0.2s ease-in-out;
    }

    .control {
      position: relative;
      width: calc(var(--input-size) * 1px);
      height: calc(var(--input-size) * 1px);
      box-sizing: border-box;
      border-radius: 50%;
      border: calc(${strokeWidth} * 1px) solid ${neutralStrokeStrongRest};
      background: ${neutralFillInputAltRest};
      cursor: pointer;
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      ${typeRampBase}
      color: ${neutralForegroundRest};
      ${/* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */
""} padding-inline-start: calc(${designUnit} * 2px + 2px);
      margin-inline-end: calc(${designUnit} * 2px + 2px);
      cursor: pointer;
    }

    .control,
    slot[name='checked-indicator'] {
      flex-shrink: 0;
    }

    slot[name='checked-indicator'] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      fill: ${foregroundOnAccentRest};
      opacity: 0;
      pointer-events: none;
    }

    :host(:not(.disabled):hover) .control {
      background: ${neutralFillInputAltHover};
      border-color: ${neutralStrokeStrongHover};
    }

    :host(:not(.disabled):active) .control {
      background: ${neutralFillInputAltActive};
      border-color: ${neutralStrokeStrongActive};
    }

    :host(:not(.disabled):active) slot[name='checked-indicator'] {
      opacity: 1;
    }

    :host(:${focusVisible}) .control {
      ${focusTreatmentTight}
      background: ${neutralFillInputAltFocus};
    }

    :host(.checked) .control {
      background: ${accentFillRest};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):hover) .control {
      background: ${accentFillHover};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):active) .control {
      background: ${accentFillActive};
      border-color: transparent;
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
      cursor: ${disabledCursor};
    }

    :host(.checked) slot[name='checked-indicator'] {
      opacity: 1;
    }

    :host(.disabled) {
      opacity: ${disabledOpacity};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .control {
          background: ${SystemColors.Field};
          border-color: ${SystemColors.FieldText};
        }
        :host(:not(.disabled):hover) .control,
        :host(:not(.disabled):active) .control {
          border-color: ${SystemColors.Highlight};
        }
        :host(:${focusVisible}) .control {
          forced-color-adjust: none;
          background: ${SystemColors.Field};
          outline-color: ${SystemColors.FieldText};
        }
        :host(.checked:not(.disabled):hover) .control,
        :host(.checked:not(.disabled):active) .control {
          border-color: ${SystemColors.Highlight};
          background: ${SystemColors.Highlight};
        }
        :host(.checked) slot[name='checked-indicator'] {
          fill: ${SystemColors.Highlight};
        }
        :host(.checked:hover) .control slot[name='checked-indicator'] {
          fill: ${SystemColors.HighlightText};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) .label {
          color: ${SystemColors.GrayText};
        }
        :host(.disabled) .control,
        :host(.checked.disabled) .control {
          background: ${SystemColors.Field};
          border-color: ${SystemColors.GrayText};
        }
        :host(.disabled) slot[name='checked-indicator'],
        :host(.checked.disabled) slot[name='checked-indicator'] {
          fill: ${SystemColors.GrayText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/radio/index.js
var fluentRadio = Radio.compose({
  baseName: "radio",
  template: radioTemplate,
  styles: radioStyles,
  checkedIndicator: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="4"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/radio-group/radio-group.styles.js
var radioGroupStyles = (context, definition) => css2`
  ${display("flex")} :host {
    align-items: flex-start;
    flex-direction: column;
  }

  .positioning-region {
    display: flex;
    flex-wrap: wrap;
  }

  :host([orientation='vertical']) .positioning-region {
    flex-direction: column;
  }

  :host([orientation='horizontal']) .positioning-region {
    flex-direction: row;
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/radio-group/index.js
var fluentRadioGroup = RadioGroup.compose({
  baseName: "radio-group",
  template: radioGroupTemplate,
  styles: radioGroupStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/search/search.template.js
var searchTemplate = (context, definition) => html2`
  <template
    class="
            ${(x) => x.readOnly ? "readonly" : ""}
        "
  >
    <label
      part="label"
      for="control"
      class="${(x) => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
    >
      <slot ${slotted({ property: "defaultSlottedNodes", filter: whitespaceFilter })}></slot>
    </label>
    <div class="root" part="root" ${ref("root")}>
      ${startSlotTemplate(context, definition)}
      <div class="input-wrapper" part="input-wrapper">
        <input
          class="control"
          part="control"
          id="control"
          @input="${(x) => x.handleTextInput()}"
          @change="${(x) => x.handleChange()}"
          ?autofocus="${(x) => x.autofocus}"
          ?disabled="${(x) => x.disabled}"
          list="${(x) => x.list}"
          maxlength="${(x) => x.maxlength}"
          minlength="${(x) => x.minlength}"
          pattern="${(x) => x.pattern}"
          placeholder="${(x) => x.placeholder}"
          ?readonly="${(x) => x.readOnly}"
          ?required="${(x) => x.required}"
          size="${(x) => x.size}"
          ?spellcheck="${(x) => x.spellcheck}"
          :value="${(x) => x.value}"
          type="search"
          aria-atomic="${(x) => x.ariaAtomic}"
          aria-busy="${(x) => x.ariaBusy}"
          aria-controls="${(x) => x.ariaControls}"
          aria-current="${(x) => x.ariaCurrent}"
          aria-describedby="${(x) => x.ariaDescribedby}"
          aria-details="${(x) => x.ariaDetails}"
          aria-disabled="${(x) => x.ariaDisabled}"
          aria-errormessage="${(x) => x.ariaErrormessage}"
          aria-flowto="${(x) => x.ariaFlowto}"
          aria-haspopup="${(x) => x.ariaHaspopup}"
          aria-hidden="${(x) => x.ariaHidden}"
          aria-invalid="${(x) => x.ariaInvalid}"
          aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
          aria-label="${(x) => x.ariaLabel}"
          aria-labelledby="${(x) => x.ariaLabelledby}"
          aria-live="${(x) => x.ariaLive}"
          aria-owns="${(x) => x.ariaOwns}"
          aria-relevant="${(x) => x.ariaRelevant}"
          aria-roledescription="${(x) => x.ariaRoledescription}"
          ${ref("control")}
        />
        <slot name="clear-button">
          <button
            class="clear-button ${(x) => x.value ? "" : "clear-button__hidden"}"
            part="clear-button"
            tabindex="-1"
            @click=${(x) => x.handleClearInput()}
          >
            <slot name="clear-glyph">
              <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m2.09 2.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L6 5.29l3.15-3.14a.5.5 0 1 1 .7.7L6.71 6l3.14 3.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L6 6.71 2.85 9.85a.5.5 0 0 1-.7-.7L5.29 6 2.15 2.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z"
                />
              </svg>
            </slot>
          </button>
        </slot>
      </div>
      ${endSlotTemplate(context, definition)}
    </div>
  </template>
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/search/search.styles.js
var logicalControlSelector4 = ".root";
var clearButtonHover = DesignToken.create("clear-button-hover").withDefault((target2) => {
  const buttonRecipe = neutralFillStealthRecipe.getValueFor(target2);
  const inputRecipe = neutralFillInputRecipe.getValueFor(target2);
  return buttonRecipe.evaluate(target2, inputRecipe.evaluate(target2).focus).hover;
});
var clearButtonActive = DesignToken.create("clear-button-active").withDefault((target2) => {
  const buttonRecipe = neutralFillStealthRecipe.getValueFor(target2);
  const inputRecipe = neutralFillInputRecipe.getValueFor(target2);
  return buttonRecipe.evaluate(target2, inputRecipe.evaluate(target2).focus).active;
});
var searchStyles = (context, definition) => css2`
    ${display("inline-block")}

    ${baseInputStyles(context, definition, logicalControlSelector4)}

    ${inputStateStyles(context, definition, logicalControlSelector4)}

    .root {
      display: flex;
      flex-direction: row;
    }
    .control {
      -webkit-appearance: none;
      color: inherit;
      background: transparent;
      border: 0;
      height: calc(100% - 4px);
      margin-top: auto;
      margin-bottom: auto;
      padding: 0 calc(${designUnit} * 2px + 1px);
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }
    .clear-button {
      display: inline-flex;
      align-items: center;
      margin: 1px;
      height: calc(100% - 2px);
      opacity: 0;
      background: transparent;
      color: ${neutralForegroundRest};
      fill: currentcolor;
      border: none;
      border-radius: calc(${controlCornerRadius} * 1px);
      min-width: calc(${heightNumber} * 1px);
      ${typeRampBase}
      outline: none;
      padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
    }
    .clear-button:hover {
      background: ${clearButtonHover};
    }
    .clear-button:active {
      background: ${clearButtonActive};
    }
    :host(:hover:not([disabled], [readOnly])) .clear-button,
    :host(:active:not([disabled], [readOnly])) .clear-button,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button {
        opacity: 1;
    }
    :host(:hover:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:active:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button__hidden {
        opacity: 0;
    }
    .control::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
    .input-wrapper {
      display: flex;
      position: relative;
      width: 100%;
    }
    .start,
    .end {
      display: flex;
      margin: 1px;
      align-items: center;
    }
    .start {
      display: flex;
      margin-inline-start: 11px;
    }
    ::slotted([slot="end"]) {
      height: 100%
    }
    .clear-button__hidden {
      opacity: 0;
    }
    .end {
        margin-inline-end: 11px;
    }
    ::slotted(${context.tagFor(Button)}) {
      margin-inline-end: 1px;
    }
  `.withBehaviors(appearanceBehavior("outline", inputOutlineStyles(context, definition, logicalControlSelector4)), appearanceBehavior("filled", inputFilledStyles(context, definition, logicalControlSelector4)), forcedColorsStylesheetBehavior(inputForcedColorStyles(context, definition, logicalControlSelector4)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/search/index.js
var Search2 = class extends Search {
  constructor() {
    super(...arguments);
    this.appearance = "outline";
  }
};
__decorate2([
  attr
], Search2.prototype, "appearance", void 0);
var fluentSearch = Search2.compose({
  baseName: "search",
  baseClass: Search,
  template: searchTemplate,
  styles: searchStyles,
  start: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg%22%3E"><path d="M8.5 3a5.5 5.5 0 0 1 4.23 9.02l4.12 4.13a.5.5 0 0 1-.63.76l-.07-.06-4.13-4.12A5.5 5.5 0 1 1 8.5 3Zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/></svg>`,
  shadowOptions: {
    delegatesFocus: true
  }
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/select/index.js
var Select2 = class extends Select {
  /**
   * @internal
   */
  appearanceChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.classList.add(newValue);
      this.classList.remove(oldValue);
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.appearance) {
      this.appearance = "outline";
    }
    if (this.listbox) {
      fillColor.setValueFor(this.listbox, neutralLayerFloating2);
    }
  }
};
__decorate2([
  attr({ mode: "fromView" })
], Select2.prototype, "appearance", void 0);
var fluentSelect = Select2.compose({
  baseName: "select",
  baseClass: Select,
  template: selectTemplate,
  styles: selectStyles,
  indicator: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/skeleton/skeleton.styles.js
var skeletonStyles = (context, definition) => css2`
    ${display("block")} :host {
      --skeleton-fill-default: ${neutralFillSecondaryRest};
      overflow: hidden;
      width: 100%;
      position: relative;
      background-color: var(--skeleton-fill, var(--skeleton-fill-default));
      --skeleton-animation-gradient-default: linear-gradient(
        270deg,
        var(--skeleton-fill, var(--skeleton-fill-default)) 0%,
        ${neutralFillSecondaryHover} 51%,
        var(--skeleton-fill, var(--skeleton-fill-default)) 100%
      );
      --skeleton-animation-timing-default: ease-in-out;
    }

    :host(.rect) {
      border-radius: calc(${controlCornerRadius} * 1px);
    }

    :host(.circle) {
      border-radius: 100%;
      overflow: hidden;
    }

    object {
      position: absolute;
      width: 100%;
      height: auto;
      z-index: 2;
    }

    object img {
      width: 100%;
      height: auto;
    }

    ${display("block")} span.shimmer {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: var(--skeleton-animation-gradient, var(--skeleton-animation-gradient-default));
      background-size: 0px 0px / 90% 100%;
      background-repeat: no-repeat;
      background-color: var(--skeleton-animation-fill, ${neutralFillSecondaryRest});
      animation: shimmer 2s infinite;
      animation-timing-function: var(--skeleton-animation-timing, var(--skeleton-timing-default));
      animation-direction: normal;
      z-index: 1;
    }

    ::slotted(svg) {
      z-index: 2;
    }

    ::slotted(.pattern) {
      width: 100%;
      height: 100%;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host{
          background-color: ${SystemColors.CanvasText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/skeleton/index.js
var fluentSkeleton = Skeleton.compose({
  baseName: "skeleton",
  template: skeletonTemplate,
  styles: skeletonStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/slider/slider.styles.js
var sliderStyles = (context, definition) => css2`
    ${display("inline-grid")} :host {
      --thumb-size: calc((${heightNumber} / 2) + ${designUnit} + (${strokeWidth} * 2));
      --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
      --track-overhang: calc((${designUnit} / 2) * -1);
      --track-width: ${designUnit};
      align-items: center;
      width: 100%;
      user-select: none;
      box-sizing: border-box;
      border-radius: calc(${controlCornerRadius} * 1px);
      outline: none;
      cursor: pointer;
    }
    :host(.horizontal) .positioning-region {
      position: relative;
      margin: 0 8px;
      display: grid;
      grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
    }
    :host(.vertical) .positioning-region {
      position: relative;
      margin: 0 8px;
      display: grid;
      height: 100%;
      grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
    }
    :host(:${focusVisible}) .thumb-cursor {
      box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter2};
    }
    .thumb-container {
      position: absolute;
      height: calc(var(--thumb-size) * 1px);
      width: calc(var(--thumb-size) * 1px);
      transition: all 0.2s ease;
    }
    .thumb-cursor {
      display: flex;
      position: relative;
      border: none;
      width: calc(var(--thumb-size) * 1px);
      height: calc(var(--thumb-size) * 1px);
      background: padding-box linear-gradient(${neutralFillRest}, ${neutralFillRest}),
        border-box ${neutralStrokeControlRest};
      border: calc(${strokeWidth} * 1px) solid transparent;
      border-radius: 50%;
      box-sizing: border-box;
    }
    .thumb-cursor::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 100%;
      margin: 4px;
      background: ${accentFillRest};
    }
    :host(:not(.disabled)) .thumb-cursor:hover::after {
      background: ${accentFillHover};
      margin: 3px;
    }
    :host(:not(.disabled)) .thumb-cursor:active::after {
      background: ${accentFillActive};
      margin: 5px;
    }
    :host(:not(.disabled)) .thumb-cursor:hover {
      background: padding-box linear-gradient(${neutralFillRest}, ${neutralFillRest}),
        border-box ${neutralStrokeControlHover};
    }
    :host(:not(.disabled)) .thumb-cursor:active {
      background: padding-box linear-gradient(${neutralFillRest}, ${neutralFillRest}),
        border-box ${neutralStrokeControlActive};
    }
    .track-start {
      background: ${accentFillRest};
      position: absolute;
      height: 100%;
      left: 0;
      border-radius: calc(${controlCornerRadius} * 1px);
    }
    :host(.horizontal) .thumb-container {
      transform: translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px));
    }
    :host(.vertical) .thumb-container {
      transform: translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * 0.5px));
    }
    :host(.horizontal) {
      min-width: calc(var(--thumb-size) * 1px);
    }
    :host(.horizontal) .track {
      right: calc(var(--track-overhang) * 1px);
      left: calc(var(--track-overhang) * 1px);
      align-self: start;
      height: calc(var(--track-width) * 1px);
    }
    :host(.vertical) .track {
      top: calc(var(--track-overhang) * 1px);
      bottom: calc(var(--track-overhang) * 1px);
      width: calc(var(--track-width) * 1px);
      height: 100%;
    }
    .track {
      background: ${neutralFillStrongRest};
      border: 1px solid ${neutralStrokeStrongRest};
      border-radius: 2px;
      box-sizing: border-box;
      position: absolute;
    }
    :host(.vertical) {
      height: 100%;
      min-height: calc(${designUnit} * 60px);
      min-width: calc(${designUnit} * 20px);
    }
    :host(.vertical) .track-start {
      height: auto;
      width: 100%;
      top: 0;
    }
    :host(.disabled),
    :host(.readonly) {
      cursor: ${disabledCursor};
    }
    :host(.disabled) {
      opacity: ${disabledOpacity};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .thumb-cursor {
          forced-color-adjust: none;
          border-color: ${SystemColors.FieldText};
          background: ${SystemColors.FieldText};
        }
        :host(:not(.disabled)) .thumb-cursor:hover,
        :host(:not(.disabled)) .thumb-cursor:active {
          background: ${SystemColors.Highlight};
        }
        .track {
          forced-color-adjust: none;
          background: ${SystemColors.FieldText};
        }
        .thumb-cursor::after,
        :host(:not(.disabled)) .thumb-cursor:hover::after,
        :host(:not(.disabled)) .thumb-cursor:active::after {
          background: ${SystemColors.Field};
        }
        :host(:${focusVisible}) .thumb-cursor {
          background: ${SystemColors.Highlight};
          border-color: ${SystemColors.Highlight};
          box-shadow: 0 0 0 1px ${SystemColors.Field}, 0 0 0 3px ${SystemColors.FieldText};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) .track,
        :host(.disabled) .thumb-cursor {
          forced-color-adjust: none;
          background: ${SystemColors.GrayText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/slider/index.js
var fluentSlider = Slider.compose({
  baseName: "slider",
  template: sliderTemplate,
  styles: sliderStyles,
  thumb: `
    <div class="thumb-cursor"></div>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/slider-label/slider-label.styles.js
var sliderLabelStyles = (context, definition) => css2`
    ${display("block")} :host {
      ${typeRampMinus1}
    }
    .root {
      position: absolute;
      display: grid;
    }
    :host(.horizontal) {
      align-self: start;
      grid-row: 2;
      margin-top: -4px;
    }
    :host(.vertical) {
      justify-self: start;
      grid-column: 2;
      margin-left: 2px;
    }
    .container {
      display: grid;
      justify-self: center;
    }
    :host(.horizontal) .container {
      grid-template-rows: auto auto;
      grid-template-columns: 0;
    }
    :host(.vertical) .container {
      grid-template-columns: auto auto;
      grid-template-rows: 0;
      min-width: calc(var(--thumb-size) * 1px);
      height: calc(var(--thumb-size) * 1px);
    }
    .label {
      justify-self: center;
      align-self: center;
      white-space: nowrap;
      max-width: 30px;
      margin: 2px 0;
    }
    .mark {
      width: calc(${strokeWidth} * 1px);
      height: calc(${designUnit} * 1px);
      background: ${neutralStrokeStrongRest};
      justify-self: center;
    }
    :host(.vertical) .mark {
      transform: rotate(90deg);
      align-self: center;
    }
    :host(.vertical) .label {
      margin-left: calc((${designUnit} / 2) * 2px);
      align-self: center;
    }
    :host(.disabled) {
      opacity: ${disabledOpacity};
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .mark {
          forced-color-adjust: none;
          background: ${SystemColors.FieldText};
        }
        :host(.disabled) {
          forced-color-adjust: none;
          opacity: 1;
        }
        :host(.disabled) .label {
          color: ${SystemColors.GrayText};
        }
        :host(.disabled) .mark {
          background: ${SystemColors.GrayText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/slider-label/index.js
var fluentSliderLabel = SliderLabel.compose({
  baseName: "slider-label",
  template: sliderLabelTemplate,
  styles: sliderLabelStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/switch/switch.styles.js
var switchStyles = (context, definition) => css2`
    :host([hidden]) {
      display: none;
    }

    ${display("inline-flex")} :host {
      align-items: center;
      outline: none;
      font-family: ${bodyFont};
      ${/*
 * Chromium likes to select label text or the default slot when
 * the checkbox is clicked. Maybe there is a better solution here?
 */
""} user-select: none;
    }

    :host(.disabled) {
      opacity: ${disabledOpacity};
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.disabled) .switch,
    :host(.readonly) .switch,
    :host(.disabled) .status-message,
    :host(.readonly) .status-message {
      cursor: ${disabledCursor};
    }

    .switch {
      position: relative;
      box-sizing: border-box;
      width: calc(((${heightNumber} / 2) + ${designUnit}) * 2px);
      height: calc(((${heightNumber} / 2) + ${designUnit}) * 1px);
      background: ${neutralFillInputAltRest};
      border-radius: calc(${heightNumber} * 1px);
      border: calc(${strokeWidth} * 1px) solid ${neutralStrokeStrongRest};
      cursor: pointer;
    }

    :host(:not(.disabled):hover) .switch {
      background: ${neutralFillInputAltHover};
      border-color: ${neutralStrokeStrongHover};
    }

    :host(:not(.disabled):active) .switch {
      background: ${neutralFillInputAltActive};
      border-color: ${neutralStrokeStrongActive};
    }

    :host(:${focusVisible}) .switch {
      ${focusTreatmentTight}
      background: ${neutralFillInputAltFocus};
    }

    :host(.checked) .switch {
      background: ${accentFillRest};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):hover) .switch {
      background: ${accentFillHover};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):active) .switch {
      background: ${accentFillActive};
      border-color: transparent;
    }

    slot[name='switch'] {
      position: absolute;
      display: flex;
      border: 1px solid transparent; /* Spacing included in the transform reference box */
      fill: ${neutralForegroundRest};
      transition: all 0.2s ease-in-out;
    }

    .status-message {
      color: ${neutralForegroundRest};
      cursor: pointer;
      ${typeRampBase}
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      color: ${neutralForegroundRest};
      ${typeRampBase}
      margin-inline-end: calc(${designUnit} * 2px + 2px);
      cursor: pointer;
    }

    ::slotted([slot="checked-message"]),
    ::slotted([slot="unchecked-message"]) {
        margin-inline-start: calc(${designUnit} * 2px + 2px);
    }

    :host(.checked) .switch {
      background: ${accentFillRest};
    }

    :host(.checked) .switch slot[name='switch'] {
      fill: ${foregroundOnAccentRest};
      filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.15));
    }

    :host(.checked:not(.disabled)) .switch:hover {
      background: ${accentFillHover};
    }

    :host(.checked:not(.disabled)) .switch:hover slot[name='switch'] {
      fill: ${foregroundOnAccentHover};
    }

    :host(.checked:not(.disabled)) .switch:active {
      background: ${accentFillActive};
    }

    :host(.checked:not(.disabled)) .switch:active slot[name='switch'] {
      fill: ${foregroundOnAccentActive};
    }

    .unchecked-message {
      display: block;
    }

    .checked-message {
      display: none;
    }

    :host(.checked) .unchecked-message {
      display: none;
    }

    :host(.checked) .checked-message {
      display: block;
    }
  `.withBehaviors(new DirectionalStyleSheetBehavior(css2`
        slot[name='switch'] {
          left: 0;
        }

        :host(.checked) slot[name='switch'] {
          left: 100%;
          transform: translateX(-100%);
        }
      `, css2`
        slot[name='switch'] {
          right: 0;
        }

        :host(.checked) slot[name='switch'] {
          right: 100%;
          transform: translateX(100%);
        }
      `), forcedColorsStylesheetBehavior(css2`
        :host(:not(.disabled)) .switch slot[name='switch'] {
          forced-color-adjust: none;
          fill: ${SystemColors.FieldText};
        }
        .switch {
          background: ${SystemColors.Field};
          border-color: ${SystemColors.FieldText};
        }
        :host(.checked) .switch {
          background: ${SystemColors.Highlight};
          border-color: ${SystemColors.Highlight};
        }
        :host(:not(.disabled):hover) .switch ,
        :host(:not(.disabled):active) .switch,
        :host(.checked:not(.disabled):hover) .switch {
          background: ${SystemColors.HighlightText};
          border-color: ${SystemColors.Highlight};
        }
        :host(.checked:not(.disabled)) .switch slot[name="switch"] {
          fill: ${SystemColors.HighlightText};
        }
        :host(.checked:not(.disabled):hover) .switch slot[name='switch'] {
          fill: ${SystemColors.Highlight};
        }
        :host(:${focusVisible}) .switch {
          forced-color-adjust: none;
          background: ${SystemColors.Field}; 
          border-color: ${SystemColors.Highlight};
          outline-color: ${SystemColors.FieldText};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) slot[name='switch'] {
          forced-color-adjust: none;
          fill: ${SystemColors.GrayText};
        }
        :host(.disabled) .switch {
          background: ${SystemColors.Field};
          border-color: ${SystemColors.GrayText};
        }
        .status-message,
        .label {
          color: ${SystemColors.FieldText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/switch/index.js
var fluentSwitch = Switch.compose({
  baseName: "switch",
  template: switchTemplate,
  styles: switchStyles,
  switch: `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="6"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tabs/tabs.styles.js
var tabsStyles = (context, definition) => css2`
      ${display("grid")} :host {
        box-sizing: border-box;
        ${typeRampBase}
        color: ${neutralForegroundRest};
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
      }

      .tablist {
        display: grid;
        grid-template-rows: calc(${heightNumber} * 1px); auto;
        grid-template-columns: auto;
        position: relative;
        width: max-content;
        align-self: end;
      }

      .start,
      .end {
        align-self: center;
      }

      .activeIndicator {
        grid-row: 2;
        grid-column: 1;
        width: 20px;
        height: 3px;
        border-radius: calc(${controlCornerRadius} * 1px);
        justify-self: center;
        background: ${accentFillRest};
      }

      .activeIndicatorTransition {
        transition: transform 0.2s ease-in-out;
      }

      .tabpanel {
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 4;
        position: relative;
      }

      :host(.vertical) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
      }

      :host(.vertical) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        position: relative;
        width: max-content;
        justify-self: end;
        align-self: flex-start;
        width: 100%;
      }

      :host(.vertical) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
      }

      :host(.vertical) .end {
        grid-row: 3;
      }

      :host(.vertical) .activeIndicator {
        grid-column: 1;
        grid-row: 1;
        width: 3px;
        height: 20px;
        margin-inline-start: calc(${focusStrokeWidth} * 1px);
        border-radius: calc(${controlCornerRadius} * 1px);
        align-self: center;
        background: ${accentFillRest};
      }

      :host(.vertical) .activeIndicatorTransition {
        transition: transform 0.2s linear;
      }
    `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        .activeIndicator,
        :host(.vertical) .activeIndicator {
          background: ${SystemColors.Highlight};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tabs/tab/tab.styles.js
var tabStyles = (context, definition) => css2`
      ${display("inline-flex")} :host {
        box-sizing: border-box;
        ${typeRampBase}
        height: calc((${heightNumber} + (${designUnit} * 2)) * 1px);
        padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
        color: ${neutralForegroundRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1 / 3;
        cursor: pointer;
      }

      :host([aria-selected='true']) {
        z-index: 2;
      }

      :host(:hover),
      :host(:active) {
        color: ${neutralForegroundRest};
      }

      :host(:${focusVisible}) {
        ${focusTreatmentBase}
      }

      :host(.vertical) {
        justify-content: start;
        grid-column: 1 / 3;
      }

      :host(.vertical[aria-selected='true']) {
        z-index: 2;
      }

      :host(.vertical:hover),
      :host(.vertical:active) {
        color: ${neutralForegroundRest};
      }

      :host(.vertical:hover[aria-selected='true']) {
      }
    `.withBehaviors(forcedColorsStylesheetBehavior(css2`
          :host {
            forced-color-adjust: none;
            border-color: transparent;
            color: ${SystemColors.ButtonText};
            fill: currentcolor;
          }
          :host(:hover),
          :host(.vertical:hover),
          :host([aria-selected='true']:hover) {
            background: transparent;
            color: ${SystemColors.Highlight};
            fill: currentcolor;
          }
          :host([aria-selected='true']) {
            background: transparent;
            color: ${SystemColors.Highlight};
            fill: currentcolor;
          }
          :host(:${focusVisible}) {
            background: transparent;
            outline-color: ${SystemColors.ButtonText};
          }
        `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tabs/tab/index.js
var fluentTab = Tab.compose({
  baseName: "tab",
  template: tabTemplate,
  styles: tabStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tabs/tab-panel/tab-panel.styles.js
var tabPanelStyles = (context, definition) => css2`
  ${display("block")} :host {
    box-sizing: border-box;
    ${typeRampBase}
    padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tabs/tab-panel/index.js
var fluentTabPanel = TabPanel.compose({
  baseName: "tab-panel",
  template: tabPanelTemplate,
  styles: tabPanelStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tabs/index.js
var fluentTabs = Tabs.compose({
  baseName: "tabs",
  template: tabsTemplate,
  styles: tabsStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/text-area/text-area.styles.js
var logicalControlSelector5 = ".control";
var textAreaStyles = (context, definition) => css2`
    ${display("inline-flex")}

    ${baseInputStyles(context, definition, logicalControlSelector5)}

    ${inputStateStyles(context, definition, logicalControlSelector5)}

    :host {
      flex-direction: column;
      vertical-align: bottom;
    }

    .control {
      height: calc((${heightNumber} * 2) * 1px);
      padding: calc(${designUnit} * 1.5px) calc(${designUnit} * 2px + 1px);
    }

    :host .control {
      resize: none;
    }

    :host(.resize-both) .control {
      resize: both;
    }

    :host(.resize-horizontal) .control {
      resize: horizontal;
    }

    :host(.resize-vertical) .control {
      resize: vertical;
    }

    :host([cols]) {
      width: initial;
    }

    :host([rows]) .control {
      height: initial;
    }
  `.withBehaviors(appearanceBehavior("outline", inputOutlineStyles(context, definition, logicalControlSelector5)), appearanceBehavior("filled", inputFilledStyles(context, definition, logicalControlSelector5)), forcedColorsStylesheetBehavior(inputForcedColorStyles(context, definition, logicalControlSelector5)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/text-area/index.js
var TextArea2 = class extends TextArea {
  /**
   * @internal
   */
  appearanceChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.classList.add(newValue);
      this.classList.remove(oldValue);
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.appearance) {
      this.appearance = "outline";
    }
  }
};
__decorate2([
  attr
], TextArea2.prototype, "appearance", void 0);
var fluentTextArea = TextArea2.compose({
  baseName: "text-area",
  baseClass: TextArea,
  template: textAreaTemplate,
  styles: textAreaStyles,
  shadowOptions: {
    delegatesFocus: true
  }
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/text-field/text-field.styles.js
var logicalControlSelector6 = ".root";
var textFieldStyles = (context, definition) => css2`
    ${display("inline-block")}

    ${baseInputStyles(context, definition, logicalControlSelector6)}

    ${inputStateStyles(context, definition, logicalControlSelector6)}

    .root {
      display: flex;
      flex-direction: row;
    }

    .control {
      -webkit-appearance: none;
      color: inherit;
      background: transparent;
      border: 0;
      height: calc(100% - 4px);
      margin-top: auto;
      margin-bottom: auto;
      padding: 0 calc(${designUnit} * 2px + 1px);
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }

    .start,
    .end {
      display: flex;
      margin: auto;
    }

    .start {
      display: flex;
      margin-inline-start: 11px;
    }

    .end {
      display: flex;
      margin-inline-end: 11px;
    }
  `.withBehaviors(appearanceBehavior("outline", inputOutlineStyles(context, definition, logicalControlSelector6)), appearanceBehavior("filled", inputFilledStyles(context, definition, logicalControlSelector6)), forcedColorsStylesheetBehavior(inputForcedColorStyles(context, definition, logicalControlSelector6)));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/text-field/index.js
var TextField2 = class extends TextField {
  /**
   * @internal
   */
  appearanceChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.classList.add(newValue);
      this.classList.remove(oldValue);
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.appearance) {
      this.appearance = "outline";
    }
  }
};
__decorate2([
  attr
], TextField2.prototype, "appearance", void 0);
var fluentTextField = TextField2.compose({
  baseName: "text-field",
  baseClass: TextField,
  template: textFieldTemplate,
  styles: textFieldStyles,
  shadowOptions: {
    delegatesFocus: true
  }
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/toolbar/toolbar.styles.js
var toolbarStyles = (context, definition) => css2`
    ${display("inline-flex")} :host {
      --toolbar-item-gap: calc(${designUnit} * 1px);
      background: ${fillColor};
      fill: currentcolor;
      padding: var(--toolbar-item-gap);
      box-sizing: border-box;
      align-items: center;
    }

    :host(${focusVisible}) {
      ${focusTreatmentBase}
    }

    .positioning-region {
      align-items: center;
      display: inline-flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      flex-grow: 1;
    }

    :host([orientation='vertical']) .positioning-region {
      flex-direction: column;
      align-items: start;
    }

    ::slotted(:not([slot])) {
      flex: 0 0 auto;
      margin: 0 var(--toolbar-item-gap);
    }

    :host([orientation='vertical']) ::slotted(:not([slot])) {
      margin: var(--toolbar-item-gap) 0;
    }

    :host([orientation='vertical']) {
      display: inline-flex;
      flex-direction: column;
    }

    .start,
    .end {
      display: flex;
      align-items: center;
    }

    .end {
      margin-inline-start: auto;
    }

    .start__hidden,
    .end__hidden {
      display: none;
    }

    ::slotted(svg) {
      ${/* Glyph size is temporary - replace when adaptive typography is figured out */
""}
      width: 16px;
      height: 16px;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host(:${focusVisible}) {
          outline-color: ${SystemColors.Highlight};
          color: ${SystemColors.ButtonText};
          forced-color-adjust: none;
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/toolbar/index.js
var Toolbar2 = class extends Toolbar {
};
var fluentToolbar = Toolbar2.compose({
  baseName: "toolbar",
  baseClass: Toolbar,
  template: toolbarTemplate,
  styles: toolbarStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tooltip/tooltip.styles.js
var tooltipStyles = (context, definition) => css2`
    :host {
      position: relative;
      contain: layout;
      overflow: visible;
      height: 0;
      width: 0;
      z-index: 10000;
    }

    .tooltip {
      box-sizing: border-box;
      border-radius: calc(${controlCornerRadius} * 1px);
      border: calc(${strokeWidth} * 1px) solid ${neutralStrokeLayerRest};
      background: ${fillColor};
      color: ${neutralForegroundRest};
      padding: 4px 12px;
      height: fit-content;
      width: fit-content;
      ${typeRampBase}
      white-space: nowrap;
      box-shadow: ${elevationShadowTooltip};
    }

    ${context.tagFor(AnchoredRegion)} {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: visible;
      flex-direction: row;
    }

    ${context.tagFor(AnchoredRegion)}.right,
    ${context.tagFor(AnchoredRegion)}.left {
      flex-direction: column;
    }

    ${context.tagFor(AnchoredRegion)}.top .tooltip::after,
    ${context.tagFor(AnchoredRegion)}.bottom .tooltip::after,
    ${context.tagFor(AnchoredRegion)}.left .tooltip::after,
    ${context.tagFor(AnchoredRegion)}.right .tooltip::after {
      content: '';
      width: 12px;
      height: 12px;
      background: ${fillColor};
      border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeLayerRest};
      border-left: calc(${strokeWidth} * 1px) solid ${neutralStrokeLayerRest};
      position: absolute;
    }

    ${context.tagFor(AnchoredRegion)}.top .tooltip::after {
      transform: translateX(-50%) rotate(225deg);
      bottom: 5px;
      left: 50%;
    }

    ${context.tagFor(AnchoredRegion)}.top .tooltip {
      margin-bottom: 12px;
    }

    ${context.tagFor(AnchoredRegion)}.bottom .tooltip::after {
      transform: translateX(-50%) rotate(45deg);
      top: 5px;
      left: 50%;
    }

    ${context.tagFor(AnchoredRegion)}.bottom .tooltip {
      margin-top: 12px;
    }

    ${context.tagFor(AnchoredRegion)}.left .tooltip::after {
      transform: translateY(-50%) rotate(135deg);
      top: 50%;
      right: 5px;
    }

    ${context.tagFor(AnchoredRegion)}.left .tooltip {
      margin-right: 12px;
    }

    ${context.tagFor(AnchoredRegion)}.right .tooltip::after {
      transform: translateY(-50%) rotate(-45deg);
      top: 50%;
      left: 5px;
    }

    ${context.tagFor(AnchoredRegion)}.right .tooltip {
      margin-left: 12px;
    }
  `.withBehaviors(forcedColorsStylesheetBehavior(css2`
        :host([disabled]) {
          opacity: 1;
        }
        ${context.tagFor(AnchoredRegion)}.top .tooltip::after,
        ${context.tagFor(AnchoredRegion)}.bottom .tooltip::after,
        ${context.tagFor(AnchoredRegion)}.left .tooltip::after,
        ${context.tagFor(AnchoredRegion)}.right .tooltip::after {
          content: '';
          width: unset;
          height: unset;
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tooltip/index.js
var Tooltip2 = class extends Tooltip {
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    fillColor.setValueFor(this, neutralLayerFloating2);
  }
};
var fluentTooltip = Tooltip2.compose({
  baseName: "tooltip",
  baseClass: Tooltip,
  template: tooltipTemplate,
  styles: tooltipStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tree-view/tree-view.styles.js
var treeViewStyles = (context, definition) => css2`
  :host([hidden]) {
    display: none;
  }

  ${display("flex")} :host {
    flex-direction: column;
    align-items: stretch;
    min-width: fit-content;
    font-size: 0;
  }
`;

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tree-view/index.js
var fluentTreeView = TreeView.compose({
  baseName: "tree-view",
  template: treeViewTemplate,
  styles: treeViewStyles
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tree-item/tree-item.styles.js
var ltr = css2`
  .expand-collapse-button svg {
    transform: rotate(0deg);
  }
  :host(.nested) .expand-collapse-button {
    left: var(--expand-collapse-button-nested-width, calc(${heightNumber} * -1px));
  }
  :host([selected])::after {
    left: calc(${focusStrokeWidth} * 1px);
  }
  :host([expanded]) > .positioning-region .expand-collapse-button svg {
    transform: rotate(90deg);
  }
`;
var rtl = css2`
  .expand-collapse-button svg {
    transform: rotate(180deg);
  }
  :host(.nested) .expand-collapse-button {
    right: var(--expand-collapse-button-nested-width, calc(${heightNumber} * -1px));
  }
  :host([selected])::after {
    right: calc(${focusStrokeWidth} * 1px);
  }
  :host([expanded]) > .positioning-region .expand-collapse-button svg {
    transform: rotate(90deg);
  }
`;
var expandCollapseButtonSize = cssPartial`((${baseHeightMultiplier} / 2) * ${designUnit}) + ((${designUnit} * ${density}) / 2)`;
var expandCollapseHover = DesignToken.create("tree-item-expand-collapse-hover").withDefault((target2) => {
  const recipe = neutralFillStealthRecipe.getValueFor(target2);
  return recipe.evaluate(target2, recipe.evaluate(target2).hover).hover;
});
var selectedExpandCollapseHover = DesignToken.create("tree-item-expand-collapse-selected-hover").withDefault((target2) => {
  const baseRecipe = neutralFillSecondaryRecipe.getValueFor(target2);
  const buttonRecipe = neutralFillStealthRecipe.getValueFor(target2);
  return buttonRecipe.evaluate(target2, baseRecipe.evaluate(target2).rest).hover;
});
var treeItemStyles = (context, definition) => css2`
    ${display("block")} :host {
      contain: content;
      position: relative;
      outline: none;
      color: ${neutralForegroundRest};
      fill: currentcolor;
      cursor: pointer;
      font-family: ${bodyFont};
      --expand-collapse-button-size: calc(${heightNumber} * 1px);
      --tree-item-nested-width: 0;
    }

    .positioning-region {
      display: flex;
      position: relative;
      box-sizing: border-box;
      background: ${neutralFillStealthRest};
      border: calc(${strokeWidth} * 1px) solid transparent;
      border-radius: calc(${controlCornerRadius} * 1px);
      height: calc((${heightNumber} + 1) * 1px);
    }

    :host(:${focusVisible}) .positioning-region {
      ${focusTreatmentBase}
    }

    .positioning-region::before {
      content: '';
      display: block;
      width: var(--tree-item-nested-width);
      flex-shrink: 0;
    }

    :host(:not([disabled])) .positioning-region:hover {
      background: ${neutralFillStealthHover};
    }

    :host(:not([disabled])) .positioning-region:active {
      background: ${neutralFillStealthActive};
    }

    .content-region {
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      width: 100%;
      height: calc(${heightNumber} * 1px);
      margin-inline-start: calc(${designUnit} * 2px + 8px);
      ${typeRampBase}
    }

    .items {
      display: none;
      ${/* Font size should be based off calc(1em + (design-unit + glyph-size-number) * 1px) -
    update when density story is figured out */
""} font-size: calc(1em + (${designUnit} + 16) * 1px);
    }

    .expand-collapse-button {
      background: none;
      border: none;
      border-radius: calc(${controlCornerRadius} * 1px);
      ${/* Width and Height should be based off calc(glyph-size-number + (design-unit * 4) * 1px) -
    update when density story is figured out */
""} width: calc((${expandCollapseButtonSize} + (${designUnit} * 2)) * 1px);
      height: calc((${expandCollapseButtonSize} + (${designUnit} * 2)) * 1px);
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin: 0 6px;
    }

    .expand-collapse-button svg {
      transition: transform 0.1s linear;
      pointer-events: none;
    }

    .start,
    .end {
      display: flex;
    }

    .start {
      ${/* need to swap out once we understand how horizontalSpacing will work */
""} margin-inline-end: calc(${designUnit} * 2px + 2px);
    }

    .end {
      ${/* need to swap out once we understand how horizontalSpacing will work */
""} margin-inline-start: calc(${designUnit} * 2px + 2px);
    }

    :host(.expanded) > .items {
      display: block;
    }

    :host([disabled]) {
      opacity: ${disabledOpacity};
      cursor: ${disabledCursor};
    }

    :host(.nested) .content-region {
      position: relative;
      margin-inline-start: var(--expand-collapse-button-size);
    }

    :host(.nested) .expand-collapse-button {
      position: absolute;
    }

    :host(.nested) .expand-collapse-button:hover {
      background: ${expandCollapseHover};
    }

    :host(:not([disabled])[selected]) .positioning-region {
      background: ${neutralFillSecondaryRest};
    }

    :host(:not([disabled])[selected]) .expand-collapse-button:hover {
      background: ${selectedExpandCollapseHover};
    }

    :host([selected])::after {
      content: '';
      display: block;
      position: absolute;
      top: calc((${heightNumber} / 4) * 1px);
      width: 3px;
      height: calc((${heightNumber} / 2) * 1px);
      ${/* The french fry background needs to be calculated based on the selected background state for this control.
    We currently have no way of changing that, so setting to accent-foreground-rest for the time being */
""} background: ${accentFillRest};
      border-radius: calc(${controlCornerRadius} * 1px);
    }

    ::slotted(fluent-tree-item) {
      --tree-item-nested-width: 1em;
      --expand-collapse-button-nested-width: calc(${heightNumber} * -1px);
    }
  `.withBehaviors(new DirectionalStyleSheetBehavior(ltr, rtl), forcedColorsStylesheetBehavior(css2`
        :host {
          color: ${SystemColors.ButtonText};
        }
        .positioning-region {
          border-color: ${SystemColors.ButtonFace};
          background: ${SystemColors.ButtonFace};
        }
        :host(:not([disabled])) .positioning-region:hover,
        :host(:not([disabled])) .positioning-region:active,
        :host(:not([disabled])[selected]) .positioning-region {
          background: ${SystemColors.Highlight};
        }
        :host .positioning-region:hover .content-region,
        :host([selected]) .positioning-region .content-region {
          forced-color-adjust: none;
          color: ${SystemColors.HighlightText};
        }
        :host([disabled][selected]) .positioning-region .content-region {
          color: ${SystemColors.GrayText};
        }
        :host([selected])::after {
          background: ${SystemColors.HighlightText};
        }
        :host(:${focusVisible}) .positioning-region {
          forced-color-adjust: none;
          outline-color: ${SystemColors.ButtonFace};
        }
        :host([disabled]),
        :host([disabled]) .content-region,
        :host([disabled]) .positioning-region:hover .content-region {
          opacity: 1;
          color: ${SystemColors.GrayText};
        }
        :host(.nested) .expand-collapse-button:hover,
        :host(:not([disabled])[selected]) .expand-collapse-button:hover {
          background: ${SystemColors.ButtonFace};
          fill: ${SystemColors.ButtonText};
        }
      `));

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/tree-item/index.js
var fluentTreeItem = TreeItem.compose({
  baseName: "tree-item",
  template: treeItemTemplate,
  styles: treeItemStyles,
  expandCollapseGlyph: `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.65 2.15a.5.5 0 000 .7L7.79 6 4.65 9.15a.5.5 0 10.7.7l3.5-3.5a.5.5 0 000-.7l-3.5-3.5a.5.5 0 00-.7 0z"/>
    </svg>
  `
});

// ../web-component-sdk/node_modules/@fluentui/web-components/dist/esm/fluent-design-system.js
function provideFluentDesignSystem(element) {
  return DesignSystem.getOrCreate(element).withPrefix("fluent");
}

// ../web-component-sdk/dist/data-table.js
var __decorate3 = function(decorators, target2, key, desc2) {
  var c = arguments.length, r = c < 3 ? target2 : desc2 === null ? desc2 = Object.getOwnPropertyDescriptor(target2, key) : desc2, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target2, key, desc2);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d2 = decorators[i])
        r = (c < 3 ? d2(r) : c > 3 ? d2(target2, key, r) : d2(target2, key)) || r;
  return c > 3 && r && Object.defineProperty(target2, key, r), r;
};
provideFluentDesignSystem().register(fluentDataGrid(), fluentDataGridRow(), fluentDataGridCell(), fluentCard());
var DataTable = class DataTable2 extends LitElement {
  constructor() {
    super(...arguments);
    this.data = [];
  }
  connectedCallback() {
    return __async(this, null, function* () {
      __superGet(DataTable2.prototype, this, "connectedCallback").call(this);
      const response = yield fetch("https://jsonplaceholder.typicode.com/todos");
      this.data = yield response.json();
    });
  }
  render() {
    return html`
    <fluent-card class="custom-card">
      <fluent-design-system-provider use-defaults>
        <fluent-data-grid>
          <fluent-data-grid-row role="row" row-type="header">
            <fluent-data-grid-cell cell-type="columnheader" grid-column="1">ID</fluent-data-grid-cell>
            <fluent-data-grid-cell cell-type="columnheader" grid-column="2">Title</fluent-data-grid-cell>
            <fluent-data-grid-cell cell-type="columnheader" grid-column="3">Completed</fluent-data-grid-cell>
          </fluent-data-grid-row>
          ${this.data.map((todo) => html`
            <fluent-data-grid-row role="row">
              <fluent-data-grid-cell grid-column="1">${todo.id}</fluent-data-grid-cell>
              <fluent-data-grid-cell grid-column="2">${todo.title}</fluent-data-grid-cell>
              <fluent-data-grid-cell grid-column="3">${todo.completed}</fluent-data-grid-cell>
            </fluent-data-grid-row>
          `)}
        </fluent-data-grid>
      </fluent-design-system-provider>
    </fluent-card>
    `;
  }
};
DataTable.styles = css`
    .custom-card {
      --card-width: 500px;
      --card-height: 400px;
      padding: 22px;
      margin: 200px auto 0px auto;
    }
    fluent-data-grid {
      width: 100%;
      border: 1px solid #ccc;
    }
  `;
__decorate3([
  property({ type: Array })
], DataTable.prototype, "data", void 0);
DataTable = __decorate3([
  customElement("data-table")
], DataTable);
var data_table_default = DataTable;
export {
  data_table_default as default
};
/*! Bundled license information:

@lit/reactive-element/development/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/development/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

tabbable/dist/index.esm.js:
  (*!
  * tabbable 5.3.3
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  *)
*/
//# sourceMappingURL=wz-sdk_dist_data-table.js.map
