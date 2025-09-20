export default {
  name: "MetaPlugin",
  description: "Plugin manager: load other plugins by URL or code",
  version: "1.0.0",
  author: "You",

  start() {
    if (!window.metaPlugins) window.metaPlugins = [];

    // Create a UI section in settings
    const Settings = revenge.ui.Settings;
    this.section = new Settings.Section("MetaPlugin Manager");

    // Input for URL
    const urlInput = new Settings.Textbox("Plugin URL", "Paste GitHub raw link", "");
    this.section.add(urlInput);

    // Load button
    this.section.add(new Settings.Button("Load from URL", () => {
      const url = urlInput.value;
      if (!url) return alert("Please enter a URL");
      fetch(url).then(r => r.text()).then(code => {
        try {
          eval(code);
          window.metaPlugins.push({ type: "url", url, code });
          alert("Plugin loaded successfully!");
        } catch (e) {
          alert("Error loading plugin: " + e);
        }
      });
    }));

    // Input for raw code
    const codeInput = new Settings.Textarea("Plugin Code", "Paste JS code here", "");
    this.section.add(codeInput);

    // Run button
    this.section.add(new Settings.Button("Run Code", () => {
      const code = codeInput.value;
      if (!code) return alert("Please paste some code");
      try {
        eval(code);
        window.metaPlugins.push({ type: "code", code });
        alert("Code executed successfully!");
      } catch (e) {
        alert("Error: " + e);
      }
    }));

    // List loaded plugins
    this.pluginList = new Settings.Section("Loaded Plugins");
    this.section.add(this.pluginList);
    this.updatePluginList();

    // Add section to settings
    revenge.ui.settings.addSection(this.section);
  },

  updatePluginList() {
    this.pluginList.clear();
    window.metaPlugins.forEach((p, i) => {
      this.pluginList.add(new revenge.ui.Settings.Label(`${p.type.toUpperCase()} Plugin ${i + 1}`));
      this.pluginList.add(new revenge.ui.Settings.Button("Unload", () => {
        window.metaPlugins.splice(i, 1);
        alert("Plugin reference removed. (Reload app to fully clear)");
        this.updatePluginList();
      }));
    });
  },

  stop() {
    revenge.ui.settings.removeSection(this.section);
  }
};
