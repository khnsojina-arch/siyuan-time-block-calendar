(() => {
  "use strict";
  var t = {
      d: (e, n) => {
        for (var s in n)
          t.o(n, s) &&
            !t.o(e, s) &&
            Object.defineProperty(e, s, { enumerable: !0, get: n[s] });
      },
      o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
      r: (t) => {
        ("undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 }));
      },
    },
    e = {};
  (t.r(e), t.d(e, { default: () => E }));
  const n = require("siyuan"),
    s = "time_block_calendar_tab",
    a = "time-block-calendar-config",
    IMPORTANT_DAYS_STORAGE_NAME = "time-block-calendar-important-days",
    i = 56 / 60,
    o = {
      notebookId: "",
      dailyRootHPath: "/daily note",
      dayStartHour: 6,
      dayEndHour: 24,
      slotMinutes: 15,
      labelOptions: [
        "自控",
        "数学",
        "英语",
        "其他",
        "考研英语",
        "学习",
        "工作",
        "生活",
      ],
      deletedLabelOptions: [],
      desktopNotificationEnabled: true,
      desktopNotificationMissedEnabled: false,
      tableReminderFiredMap: {},
      pomodoroVisible: true,
      pomodoroRecords: [],
      aiEnabled: false,
      aiProvider: "openai-compatible",
      aiBaseURL: "",
      aiApiKey: "",
      aiModel: "deepseek-chat",
      aiTemperature: 0.1,
      aiMaxTokens: 2000,
      aiTimeoutMs: 30000,
    },
    r = [
      { name: "天空蓝", value: "#38bdf8", bg: "#e0f7ff", text: "#075985" },
      { name: "薄荷绿", value: "#22c55e", bg: "#dcfce7", text: "#166534" },
      { name: "暖橙", value: "#f97316", bg: "#ffedd5", text: "#9a3412" },
      { name: "玫瑰红", value: "#fb7185", bg: "#ffe4e6", text: "#9f1239" },
      { name: "紫罗兰", value: "#8b5cf6", bg: "#ede9fe", text: "#5b21b6" },
      { name: "石墨灰", value: "#64748b", bg: "#f1f5f9", text: "#334155" },
      { name: "湖水青", value: "#14b8a6", bg: "#ccfbf1", text: "#115e59" },
      { name: "青柠", value: "#84cc16", bg: "#ecfccb", text: "#3f6212" },
      { name: "琥珀", value: "#f59e0b", bg: "#fef3c7", text: "#92400e" },
      { name: "珊瑚", value: "#ef4444", bg: "#fee2e2", text: "#991b1b" },
      { name: "粉紫", value: "#d946ef", bg: "#fae8ff", text: "#86198f" },
      { name: "靛蓝", value: "#6366f1", bg: "#e0e7ff", text: "#3730a3" },
      { name: "咖啡", value: "#a16207", bg: "#fef3c7", text: "#713f12" },
      { name: "深青", value: "#0f766e", bg: "#ccfbf1", text: "#134e4a" },
    ],
    c = r[0];
  function l(t) {
    return r.find((e) => e.value === t) || c;
  }
  function d(t) {
    return `${t.getFullYear()}年${t.getMonth() + 1}月`;
  }
  function u(t, e) {
    return new Promise((s, a) => {
      (0, n.fetchPost)(t, e, (e) => {
        e?.code && 0 !== e.code
          ? a(new Error(e.msg || `SiYuan API error: ${t}`))
          : s(e?.data);
      });
    });
  }
  function h(t) {
    const e = new Date(t);
    return (e.setHours(0, 0, 0, 0), e);
  }
  function m(t, e) {
    const n = new Date(t);
    return (n.setDate(n.getDate() + e), n);
  }
  function b(t) {
    const e = h(t),
      n = e.getDay();
    return m(e, 0 === n ? -6 : 1 - n);
  }
  function v(t) {
    return String(t).padStart(2, "0");
  }
  function p(t) {
    return `${t.getFullYear()}-${v(t.getMonth() + 1)}-${v(t.getDate())}`;
  }
  function f(t) {
    return `${v(t.getHours())}:${v(t.getMinutes())}`;
  }
  function g(t) {
    const e = -t.getTimezoneOffset(),
      n = e >= 0 ? "+" : "-",
      s = Math.abs(e);
    return `${p(t)}T${f(t)}:00${n}${v(Math.floor(s / 60))}:${v(s % 60)}`;
  }
  function y(t) {
    return t
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function w(t) {
    return t
      .replace(/^[-*]\s+\[[ xX]\]\s+/, "")
      .replace(/^[-*]\s+/, "")
      .replace(/^#+\s+/, "")
      .trim()
      .split("\n")[0]
      .slice(0, 120);
  }
  class E extends n.Plugin {
    constructor() {
      (super(...arguments),
        (this.config = o),
        (this.currentDate = new Date()),
        (this.viewMode = "week"),
        (this.lastCalendarViewMode = "week"),
        (this.pomodoroMode = "countdown"),
        (this.pomodoroMinutes = 25),
        (this.pomodoroElapsed = 0),
        (this.pomodoroRunning = !1),
        (this.pomodoroStartedAt = 0),
        (this.pomodoroSessionStartedAt = 0),
        (this.pomodoroTimer = void 0),
        (this.monthGoalQuery = ""),
        (this.monthGoalStatus = "all"),
        (this.events = []),
        (this.tableWriteQueues = new Map()),
        (this.recentlyDeletedEventIds = new Map()),
        (this.statusSyncTimer = void 0),
        (this.statusSyncBusy = !1),
        (this.nowLineTimer = void 0),
        (this.reminderTimer = void 0),
        (this.settingsDraftConfig = void 0),
        (this.importantDaysState = this.defaultImportantDaysState()),
        (this.aiDialogOpen = !1),
        (this.aiPreviewResult = void 0),
        (this.reminderBusy = !1),
        (this.reminderNotifiedInSession = new Set()));
    }
    onload() {
      this.addIcons(
        '\n      <symbol id="iconTimeBlockCalendar" viewBox="0 0 32 32">\n        <path d="M7 4h2v3h14V4h2v3h3v21H4V7h3V4zm19 9H6v13h20V13zM6 11h20V9H6v2zm4 5h5v4h-5v-4zm7 0h5v4h-5v-4z"/>\n      </symbol>\n    ',
      );
      const t = this;
      ((this.customTab = this.addTab({
        type: s,
        init() {
          ((this.element.innerHTML =
            '\n          <div class="stbc-root">\n            <div class="stbc-empty">\n              时间块日历正在加载...\n            </div>\n          </div>\n        '),
            (t.rootElement = this.element.querySelector(".stbc-root")),
            t.render().catch((e) => {
              (console.error(e),
                t.rootElement &&
                  (t.rootElement.innerHTML = `\n              <div class="stbc-empty">\n                <h2>时间块日历加载失败</h2>\n                <p>${y(e.message || String(e))}</p>\n              </div>\n            `),
                (0, n.showMessage)(
                  `时间块日历加载失败：${e.message || String(e)}`,
                ));
            }));
        },
        destroy() {
          t.rootElement = void 0;
        },
      })),
        this.addCommand({
          langKey: "openTimeBlockCalendar",
          hotkey: "⌥⌘C",
          callback: () => this.openCalendarTab(),
        }),
        (this.setting = new n.Setting({
          confirmCallback: () => {
            (this.settingsDraftConfig && (this.config = { ...this.config, ...this.settingsDraftConfig }),
              (this.settingsDraftConfig = void 0),
              this.saveData(a, this.config),
              this.renderPomodoroPanel(),
              (0, n.showMessage)("时间块日历设置已保存"));
          },
        })),
        this.addSettings(),
        this.startStatusSyncTimer(),
        this.startNowLineTimer(),
        this.startReminderTimer());
    }
    onunload() {
      (this.stopPomodoroTimer(), this.stopStatusSyncTimer(), this.stopNowLineTimer(), this.stopReminderTimer());
    }
    async uninstall() {
      await this.removeData(a);
    }
    async onLayoutReady() {
      const t = await this.loadData(a).catch(() => {});
      this.config = { ...o, ...(t || {}) };
      this.addTopBar({
        icon: "iconTimeBlockCalendar",
        title: "时间块日历",
        position: "left",
        callback: () => this.openCalendarTab(),
      });
    }
    getSettingsDraftConfig() {
      return (
        this.settingsDraftConfig ||
        (this.settingsDraftConfig = {
          notebookId: this.config.notebookId,
          dailyRootHPath: this.config.dailyRootHPath,
          desktopNotificationEnabled: this.config.desktopNotificationEnabled,
          desktopNotificationMissedEnabled: this.config.desktopNotificationMissedEnabled,
          pomodoroVisible: this.config.pomodoroVisible,
          aiEnabled: Boolean(this.config.aiEnabled),
          aiProvider: this.config.aiProvider || "openai-compatible",
          aiBaseURL: this.config.aiBaseURL || "",
          aiApiKey: this.config.aiApiKey || "",
          aiModel: this.config.aiModel || "deepseek-chat",
          aiTemperature: Number(this.config.aiTemperature ?? 0.1),
          aiMaxTokens: Number(this.config.aiMaxTokens || 2000),
          aiTimeoutMs: Number(this.config.aiTimeoutMs || 30000),
        })
      );
    }
    addSettings() {
      const t = document.createElement("select");
      ((t.className = "b3-select fn__block"),
        t.addEventListener("change", () => {
          this.getSettingsDraftConfig().notebookId = t.value;
        }),
        this.setting.addItem({
          title: "笔记本",
          description: "选择用于创建 daily note 日期文档的笔记本（自动列出已打开的笔记本，无需手填 ID）。",
          createActionElement: () => {
            ((this.getSettingsDraftConfig().notebookId = this.config.notebookId), this.populateNotebookSelect(t));
            return t;
          },
        }));
      const e = document.createElement("input");
      ((e.className = "b3-text-field fn__block"),
        (e.value = this.config.dailyRootHPath),
        e.addEventListener("change", () => {
          this.getSettingsDraftConfig().dailyRootHPath = e.value.trim() || "/daily note";
        }),
        this.setting.addItem({
          title: "日记根路径",
          description:
            "默认 /daily note，事件会写入 /daily note/YYYY/MM/YYYY-MM-DD；也支持 {{now | date \"2006/2006-01\"}}、{{now | WeekdayCN}} 这类路径模板。",
          createActionElement: () => {
            const t = this.getSettingsDraftConfig();
            return ((t.dailyRootHPath = this.config.dailyRootHPath), (e.value = this.config.dailyRootHPath), e);
          },
        }));
      const pomodoroToggle = document.createElement("label"),
        pomodoroCheckbox = document.createElement("input");
      ((pomodoroToggle.className = "stbc-setting-checkbox"),
        (pomodoroCheckbox.type = "checkbox"),
        (pomodoroCheckbox.checked = !1 !== this.config.pomodoroVisible),
        pomodoroToggle.appendChild(pomodoroCheckbox),
        pomodoroToggle.appendChild(document.createTextNode(" 显示左侧番茄钟小组件")),
        pomodoroCheckbox.addEventListener("change", () => {
          this.getSettingsDraftConfig().pomodoroVisible = pomodoroCheckbox.checked;
        }),
        this.setting.addItem({
          title: "番茄钟小组件",
          description: "关闭后左侧只保留小日历；开启后，超过 1 分钟的专注记录会显示在番茄钟下方，并可补充备注。",
          createActionElement: () => {
            const t = this.getSettingsDraftConfig();
            return ((t.pomodoroVisible = this.config.pomodoroVisible), (pomodoroCheckbox.checked = !1 !== this.config.pomodoroVisible), pomodoroToggle);
          },
        }));
      const s = document.createElement("div"),
        a = document.createElement("label"),
        i = document.createElement("input"),
        o = document.createElement("button");
      ((s.className = "stbc-setting-notification"),
        (a.className = "stbc-setting-checkbox"),
        (i.type = "checkbox"),
        (i.checked = !1 !== this.config.desktopNotificationEnabled),
        (o.className = "b3-button b3-button--outline"),
        (o.type = "button"),
        (o.textContent = "授权/测试系统通知"),
        a.appendChild(i),
        a.appendChild(document.createTextNode(" 启用电脑系统通知")),
        s.appendChild(a),
        s.appendChild(o),
        i.addEventListener("change", () => {
          this.getSettingsDraftConfig().desktopNotificationEnabled = i.checked;
        }),
        o.addEventListener("click", async () => {
          this.getSettingsDraftConfig().desktopNotificationEnabled = true;
          i.checked = true;
          const t = await this.ensureDesktopNotificationPermission(true);
          t &&
            this.showDesktopSystemNotification(
              "⏰ 时间块日历测试提醒",
              "如果你看到这条通知，说明电脑系统通知已经可以使用。",
              { allowMissed: true },
            );
        }),
        this.setting.addItem({
          title: "电脑系统通知",
          description:
            "到点后会调用 Windows/macOS/Linux 的原生系统通知，同时保留思源内提醒。思源未运行时仍不会实时提醒。",
          createActionElement: () => {
            const t = this.getSettingsDraftConfig();
            return ((t.desktopNotificationEnabled = this.config.desktopNotificationEnabled), (i.checked = !1 !== this.config.desktopNotificationEnabled), s);
          },
        }));
      const r = document.createElement("label"),
        c = document.createElement("input");
      ((r.className = "stbc-setting-checkbox"),
        (c.type = "checkbox"),
        (c.checked = !0 === this.config.desktopNotificationMissedEnabled),
        r.appendChild(c),
        r.appendChild(document.createTextNode(" 错过提醒也发送系统通知")),
        c.addEventListener("change", () => {
          this.getSettingsDraftConfig().desktopNotificationMissedEnabled = c.checked;
        }),
        this.setting.addItem({
          title: "错过提醒补发",
          description:
            "关闭时，重新打开思源后只在笔记内补发旧提醒，避免系统通知被大量刷屏。",
          createActionElement: () => {
            const t = this.getSettingsDraftConfig();
            return ((t.desktopNotificationMissedEnabled = this.config.desktopNotificationMissedEnabled), (c.checked = !0 === this.config.desktopNotificationMissedEnabled), r);
          },
        }));
      const aiBox = document.createElement("div"),
        aiToggleLabel = document.createElement("label"),
        aiToggle = document.createElement("input"),
        aiBaseURLInput = document.createElement("input"),
        aiApiKeyInput = document.createElement("input"),
        aiModelInput = document.createElement("input"),
        aiTemperatureInput = document.createElement("input"),
        aiMaxTokensInput = document.createElement("input"),
        aiTimeoutInput = document.createElement("input"),
        aiTestButton = document.createElement("button"),
        aiHelp = document.createElement("div"),
        makeAiField = (title, description, input) => {
          const row = document.createElement("label"),
            titleEl = document.createElement("span"),
            descEl = document.createElement("small");
          row.className = "stbc-ai-setting-row";
          titleEl.className = "stbc-ai-setting-title";
          descEl.className = "stbc-ai-setting-desc";
          titleEl.textContent = title;
          descEl.textContent = description;
          input.setAttribute("aria-label", title);
          row.appendChild(titleEl);
          row.appendChild(descEl);
          row.appendChild(input);
          return row;
        };
      ((aiBox.className = "stbc-ai-settings"),
        (aiToggleLabel.className = "stbc-setting-checkbox stbc-ai-enable-row"),
        (aiToggle.type = "checkbox"),
        (aiBaseURLInput.className = "b3-text-field fn__block"),
        (aiBaseURLInput.placeholder = "https://api.deepseek.com/v1"),
        (aiBaseURLInput.title = "API Base URL：OpenAI-compatible 接口根地址，不要带 /chat/completions。DeepSeek 官方通常填写 https://api.deepseek.com/v1"),
        (aiApiKeyInput.className = "b3-text-field fn__block"),
        (aiApiKeyInput.type = "password"),
        (aiApiKeyInput.placeholder = "sk-..."),
        (aiApiKeyInput.title = "API Key：服务商提供的密钥，仅保存在本地插件设置中。"),
        (aiModelInput.className = "b3-text-field fn__block"),
        (aiModelInput.placeholder = "deepseek-chat"),
        (aiModelInput.title = "模型名称：服务商支持的 Chat Completions 模型，例如 deepseek-chat。"),
        (aiTemperatureInput.className = "b3-text-field fn__block"),
        (aiTemperatureInput.type = "number"),
        (aiTemperatureInput.min = "0"),
        (aiTemperatureInput.max = "2"),
        (aiTemperatureInput.step = "0.1"),
        (aiTemperatureInput.title = "Temperature：控制随机性。日程解析建议 0.1，越低越稳定。"),
        (aiMaxTokensInput.className = "b3-text-field fn__block"),
        (aiMaxTokensInput.type = "number"),
        (aiMaxTokensInput.min = "256"),
        (aiMaxTokensInput.max = "20000"),
        (aiMaxTokensInput.title = "Max Tokens：限制 AI 最多返回多少内容。批量识别很多日程时可以适当调大。"),
        (aiTimeoutInput.className = "b3-text-field fn__block"),
        (aiTimeoutInput.type = "number"),
        (aiTimeoutInput.min = "5000"),
        (aiTimeoutInput.step = "1000"),
        (aiTimeoutInput.title = "请求超时：单位毫秒。网络较慢或模型响应慢时可以调大。"),
        (aiTestButton.className = "b3-button b3-button--outline"),
        (aiTestButton.type = "button"),
        (aiTestButton.dataset.action = "ai-test-connection"),
        (aiTestButton.textContent = "测试连接"),
        (aiHelp.className = "stbc-setting-help stbc-ai-setting-help"),
        (aiHelp.textContent = "支持 OpenAI-compatible API。常见配置：DeepSeek Base URL 填 https://api.deepseek.com/v1，模型填 deepseek-chat。"),
        aiToggleLabel.appendChild(aiToggle),
        aiToggleLabel.appendChild(document.createTextNode(" 启用 AI 功能")),
        aiBox.appendChild(aiToggleLabel),
        aiBox.appendChild(makeAiField("API Base URL", "接口根地址，例如 https://api.deepseek.com/v1；不要填写 /chat/completions。", aiBaseURLInput)),
        aiBox.appendChild(makeAiField("API Key", "服务商密钥，仅保存在本地插件设置中，不会写入日程或导出备份。", aiApiKeyInput)),
        aiBox.appendChild(makeAiField("模型名称", "用于解析自然语言的模型名称，例如 deepseek-chat、gpt-4o-mini 或服务商提供的其他模型。", aiModelInput)),
        aiBox.appendChild(makeAiField("Temperature", "控制随机性；AI 日程解析建议保持 0.1，越低越稳定，越高越发散。", aiTemperatureInput)),
        aiBox.appendChild(makeAiField("Max Tokens", "AI 最多返回的内容长度；批量识别多条安排时可适当调高。", aiMaxTokensInput)),
        aiBox.appendChild(makeAiField("请求超时 ms", "请求等待时间，单位毫秒；默认 30000，网络慢时可调大。", aiTimeoutInput)),
        aiBox.appendChild(aiTestButton),
        aiBox.appendChild(aiHelp));
      const syncAiDraft = () => {
        const draft = this.getSettingsDraftConfig();
        ((draft.aiEnabled = aiToggle.checked),
          (draft.aiProvider = "openai-compatible"),
          (draft.aiBaseURL = aiBaseURLInput.value.trim()),
          (draft.aiApiKey = aiApiKeyInput.value.trim()),
          (draft.aiModel = aiModelInput.value.trim() || "deepseek-chat"),
          (draft.aiTemperature = Math.max(0, Math.min(2, Number(aiTemperatureInput.value || 0.1)))),
          (draft.aiMaxTokens = Math.max(256, Number(aiMaxTokensInput.value || 2000))),
          (draft.aiTimeoutMs = Math.max(5000, Number(aiTimeoutInput.value || 30000))));
      };
      [aiToggle, aiBaseURLInput, aiApiKeyInput, aiModelInput, aiTemperatureInput, aiMaxTokensInput, aiTimeoutInput].forEach((input) => {
        input.addEventListener("change", syncAiDraft);
        input.addEventListener("input", syncAiDraft);
      });
      aiTestButton.addEventListener("click", async () => {
        syncAiDraft();
        const oldConfig = this.config;
        this.config = { ...this.config, ...this.getSettingsDraftConfig() };
        aiTestButton.disabled = true;
        aiHelp.textContent = "正在测试连接...";
        try {
          await this.testAiConnection();
          aiHelp.textContent = "连接成功。";
          (0, n.showMessage)("AI 连接成功");
        } catch (t) {
          const e = t instanceof Error ? t.message : String(t);
          aiHelp.textContent = `连接失败：${this.maskAiError(e)}`;
          (0, n.showMessage)(`AI 连接失败：${this.maskAiError(e)}`);
        } finally {
          this.config = oldConfig;
          aiTestButton.disabled = false;
        }
      });
      this.setting.addItem({
        title: "AI 快速创建",
        description: "API Key 仅保存在本地插件设置中；AI 只负责解析，创建前必须由你确认。",
        createActionElement: () => {
          const t = this.getSettingsDraftConfig();
          return (
            (t.aiEnabled = Boolean(this.config.aiEnabled)),
            (t.aiProvider = this.config.aiProvider || "openai-compatible"),
            (t.aiBaseURL = this.config.aiBaseURL || ""),
            (t.aiApiKey = this.config.aiApiKey || ""),
            (t.aiModel = this.config.aiModel || "deepseek-chat"),
            (t.aiTemperature = Number(this.config.aiTemperature ?? 0.1)),
            (t.aiMaxTokens = Number(this.config.aiMaxTokens || 2000)),
            (t.aiTimeoutMs = Number(this.config.aiTimeoutMs || 30000)),
            (aiToggle.checked = Boolean(t.aiEnabled)),
            (aiBaseURLInput.value = t.aiBaseURL),
            (aiApiKeyInput.value = t.aiApiKey),
            (aiModelInput.value = t.aiModel),
            (aiTemperatureInput.value = String(t.aiTemperature)),
            (aiMaxTokensInput.value = String(t.aiMaxTokens)),
            (aiTimeoutInput.value = String(t.aiTimeoutMs)),
            (aiHelp.textContent = "支持 OpenAI-compatible API。常见配置：DeepSeek Base URL 填 https://api.deepseek.com/v1，模型填 deepseek-chat。"),
            aiBox
          );
        },
      });
    }
    isMobileFrontend() {
      return String(n.getFrontend?.() || "").endsWith("mobile");
    }
    prefersReducedMotion() {
      return Boolean(
        "undefined" != typeof window &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
      );
    }
    getGsap() {
      const t = "undefined" != typeof window ? window.gsap : void 0;
      return t && "function" == typeof t.fromTo && "function" == typeof t.to
        ? t
        : void 0;
    }
    getAnimationTargets(t) {
      return (t && "number" == typeof t.length && !t.nodeType
        ? Array.from(t)
        : [t]
      ).filter((t) => t && 1 === t.nodeType);
    }
    animationTransformFromVars(t = {}) {
      const e = [];
      return (
        null != t.x && e.push(`translateX(${Number(t.x) || 0}px)`),
        null != t.y && e.push(`translateY(${Number(t.y) || 0}px)`),
        null != t.scale && e.push(`scale(${Number(t.scale) || 1})`),
        e.length ? e.join(" ") : "none"
      );
    }
    animateFromTo(t, e, n = {}) {
      const s = this.getAnimationTargets(t);
      if (!s.length || this.prefersReducedMotion()) return;
      const a = this.getGsap();
      if (a)
        return void a.fromTo(s, e, {
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
          ...n,
        });
      const i = 1e3 * Number(n.duration || 0.22),
        o = Number(n.stagger || 0),
        r = this.animationTransformFromVars(e),
        c = this.animationTransformFromVars(n);
      s.forEach((t, s) => {
        const a = t.animate?.(
          [
            {
              opacity: null != e.autoAlpha ? e.autoAlpha : null != e.opacity ? e.opacity : 1,
              transform: r,
            },
            {
              opacity: null != n.autoAlpha ? n.autoAlpha : null != n.opacity ? n.opacity : 1,
              transform: c,
            },
          ],
          {
            duration: i,
            delay: 1e3 * o * s,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "both",
          },
        );
        a &&
          (a.onfinish = () => {
            ((t.style.opacity = ""), (t.style.transform = ""));
          });
      });
    }
    animateTo(t, e = {}) {
      const n = this.getAnimationTargets(t);
      if (!n.length || this.prefersReducedMotion()) return;
      const s = this.getGsap();
      if (s)
        return void s.to(n, {
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
          ...e,
        });
      this.animateFromTo(n, { scale: 1 }, { duration: e.duration || 0.18, scale: e.scale || 1 });
    }
    animateCalendarEntrance() {
      const t = this.rootElement?.querySelector(".stbc-calendar-panel");
      if (!t) return;
      this.animateFromTo(t.firstElementChild, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.2 });
      const e = Array.from(t.querySelectorAll(".stbc-event")).slice(0, 36);
      e.length &&
        this.animateFromTo(
          e,
          { autoAlpha: 0, y: 22, scale: 0.92 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.25)", stagger: 0.026 },
        );
      const n = Array.from(
        t.querySelectorAll(
          ".stbc-all-day-event, .stbc-month-event, .stbc-goal-card, .stbc-year-month, .stbc-days-card",
        ),
      ).slice(0, 48);
      n.length &&
        this.animateFromTo(
          n,
          { autoAlpha: 0, y: 6, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, stagger: 0.012 },
        );
    }
    animateInspectorEntrance(t) {
      this.animateFromTo(t, { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 0.2 });
    }
    animateSelectedEvent(t) {
      const e = this.rootElement?.querySelectorAll(`[data-id="${t}"]`);
      this.animateTo(e, { scale: 1.015, duration: 0.12, yoyo: true, repeat: 1 });
    }
    openCalendarTab() {
      if (this.isMobileFrontend()) return this.openCalendarDialog();
      (0, n.openTab)({
        app: this.app,
        custom: {
          icon: "iconTimeBlockCalendar",
          title: "时间块日历",
          id: this.name + s,
          data: { text: "时间块日历" },
        },
      });
    }
    openCalendarDialog() {
      const t = new n.Dialog({
        title: "时间块日历",
        content:
          '<div class="stbc-root"><div class="stbc-empty">时间块日历正在加载...</div></div>',
        width: this.isMobileFrontend() ? "100vw" : "92vw",
        height: this.isMobileFrontend() ? "100vh" : "86vh",
      });
      ((this.rootElement = t.element.querySelector(".stbc-root")),
        this.render().catch((t) => {
          (this.rootElement &&
            (this.rootElement.innerHTML = `\n          <div class="stbc-empty">\n            <h2>时间块日历加载失败</h2>\n            <p>${y(t.message || String(t))}</p>\n          </div>\n        `),
            (0, n.showMessage)(
              `时间块日历加载失败：${t.message || String(t)}`,
            ));
        }));
    }
    async render() {
      this.rootElement &&
        (this.rootElement.classList.toggle("is-mobile", this.isMobileFrontend()),
        (this.rootElement.innerHTML = this.renderShellV2()),
        this.bindToolbar(),
        this.bindHorizontalWheelScroll(),
        await this.loadEvents(),
        await this.loadImportantDays(),
        this.renderMainViewV2(),
        this.renderMiniMonthV2(),
        this.renderPomodoroPanel(),
        this.renderInspector());
    }
    renderShell() {
      return `\n      <div class="stbc-toolbar">\n        <div class="stbc-toolbar-title">${d(this.currentDate)}</div>\n        <select class="stbc-select" data-action="view">\n          <option value="week" ${"week" === this.viewMode ? "selected" : ""}>周</option>\n          <option value="month" ${"month" === this.viewMode ? "selected" : ""}>月</option>\n        </select>\n        <button class="stbc-button" data-action="today">今天</button>\n        <button class="stbc-button" data-action="prev">‹</button>\n        <button class="stbc-button" data-action="next">›</button>\n        <button class="stbc-button" data-action="refresh">刷新</button>\n      </div>\n      <div class="stbc-body">\n        <aside class="stbc-sidebar">\n          <div class="stbc-mini-month"></div>\n        </aside>\n        <main class="stbc-main"></main>\n        <aside class="stbc-inspector"></aside>\n      </div>\n    `;
    }
    getToolbarTitleV2() {
      if ("goals" === this.viewMode)
        return `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月目标`;
      if ("important-days" === this.viewMode)
        return `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月倒数日`;
      return "year" === this.viewMode
        ? `${this.currentDate.getFullYear()}年`
        : "three" === this.viewMode
          ? `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月${this.currentDate.getDate()}日 - ${m(this.currentDate, 2).getMonth() + 1}月${m(this.currentDate, 2).getDate()}日`
          : `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月`;
    }
    renderShellV2() {
      const title = this.getToolbarTitleV2();
      return `
      <div class="stbc-toolbar">
        <div class="stbc-toolbar-title">${title}</div>
        <div class="stbc-toolbar-actions">
          <button class="stbc-button stbc-ai-button ${this.aiDialogOpen ? "is-active" : ""}" data-action="ai-open" type="button">✨ AI 助手</button>
          <button class="stbc-button stbc-days-toggle ${"important-days" === this.viewMode ? "is-active" : ""}" data-action="important-days" type="button">倒数日</button>
          <button class="stbc-button stbc-goals-toggle ${"goals" === this.viewMode ? "is-active" : ""}" data-action="goals" type="button">本月目标</button>
          <select class="stbc-select" data-action="view" aria-label="切换视图">
            <option value="week" ${"week" === this.viewMode ? "selected" : ""}>周</option>
            <option value="three" ${"three" === this.viewMode ? "selected" : ""}>三天</option>
            <option value="month" ${"month" === this.viewMode ? "selected" : ""}>月</option>
            <option value="year" ${"year" === this.viewMode ? "selected" : ""}>年</option>
          </select>
          <button class="stbc-icon-button stbc-settings-button" data-action="settings" title="设置 / 导入导出" aria-label="设置 / 导入导出">⚙</button>
          <button class="stbc-icon-button stbc-refresh-button" data-action="refresh" title="刷新" aria-label="刷新">↻</button>
        </div>
      </div>
      <div class="stbc-body">
        <aside class="stbc-sidebar">
          <div class="stbc-mini-month"></div>
          <div class="stbc-pomodoro-panel"></div>
        </aside>
        <main class="stbc-main">
          <div class="stbc-calendar-panel"></div>
        </main>
        <aside class="stbc-inspector"></aside>
      </div>
    `;
    }
    renderMainViewV2() {
      this.rootElement?.classList.toggle("is-goals-view", "goals" === this.viewMode);
      this.rootElement?.classList.toggle("is-important-days-view", "important-days" === this.viewMode);
      this.rootElement?.querySelector(".stbc-calendar-panel")?.classList.remove("is-hidden");
      ("important-days" === this.viewMode
        ? this.renderImportantDaysView()
        : "goals" === this.viewMode
        ? this.renderMonthGoalsV2()
        : "week" === this.viewMode
          ? this.renderWeekV2()
          : "three" === this.viewMode
            ? this.renderThreeDayV2()
            : "year" === this.viewMode
              ? this.renderYearV2()
              : this.renderMonthV2(),
        this.animateCalendarEntrance());
    }
    renderMiniMonthV2() {
      const t = this.rootElement?.querySelector(".stbc-mini-month");
      if (!t) return;
      const e = b(
          new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            1,
          ),
        ),
        n = p(new Date()),
        s = p(this.currentDate),
        a = new Set(this.events.map((t) => p(t.start)));
      ((t.innerHTML = `\n        <div class="stbc-mini-card">\n          <div class="stbc-mini-head">\n            <button class="stbc-mini-nav" data-action="mini-prev" type="button" title="上个月" aria-label="上个月">‹</button>\n            <span>${d(this.currentDate)}</span>\n            <button class="stbc-mini-nav" data-action="mini-next" type="button" title="下个月" aria-label="下个月">›</button>\n            <button class="stbc-mini-today" data-action="today" type="button">今天</button>\n          </div>\n        <div class="stbc-mini-weekdays">\n          ${["一", "二", "三", "四", "五", "六", "日"].map((t) => `<span>${t}</span>`).join("")}\n        </div>\n        <div class="stbc-mini-grid">\n          ${Array.from(
        { length: 42 },
        (t, i) => {
          const o = m(e, i),
            r = p(o);
          return `<button class="${["stbc-mini-cell", o.getMonth() !== this.currentDate.getMonth() ? "is-outside" : "", r === n ? "is-current" : "", r === s ? "is-selected" : "", a.has(r) ? "has-event" : ""].filter(Boolean).join(" ")}" data-date="${r}" type="button">${o.getDate()}</button>`;
        },
      ).join("")}\n        </div>\n      </div>\n    `),
        t
          .querySelector('[data-action="today"]')
          ?.addEventListener("click", () => {
            ((this.currentDate = new Date()),
              (this.viewMode = "goals" === this.viewMode ? "goals" : "important-days" === this.viewMode ? "important-days" : "three" === this.viewMode ? "three" : "week"),
              this.render());
          }),
        t
          .querySelector('[data-action="mini-prev"]')
          ?.addEventListener("click", () => {
            ((this.currentDate = new Date(
              this.currentDate.getFullYear(),
              this.currentDate.getMonth() - 1,
              1,
            )),
              this.render());
          }),
        t
          .querySelector('[data-action="mini-next"]')
          ?.addEventListener("click", () => {
            ((this.currentDate = new Date(
              this.currentDate.getFullYear(),
              this.currentDate.getMonth() + 1,
              1,
            )),
              this.render());
          }),
        t.querySelectorAll("[data-date]").forEach((t) => {
          t.addEventListener("click", () => {
            ((this.currentDate = new Date(`${t.dataset.date}T12:00:00`)),
              (this.viewMode = "goals" === this.viewMode ? "goals" : "important-days" === this.viewMode ? "important-days" : "three" === this.viewMode ? "three" : "week"),
              this.render());
          });
        }));
    }
    getPomodoroElapsedSeconds() {
      const t = this.pomodoroRunning ? Math.floor((Date.now() - this.pomodoroStartedAt) / 1000) : 0;
      return Math.max(0, Math.round(this.pomodoroElapsed || 0) + t);
    }
    getPomodoroSeconds() {
      const t = Math.max(1, Number(this.pomodoroMinutes || 25)) * 60,
        e = this.getPomodoroElapsedSeconds();
      return "countdown" === this.pomodoroMode ? Math.max(0, t - e) : e;
    }
    formatPomodoroTime(t) {
      const e = Math.max(0, Math.floor(Number(t || 0))),
        n = Math.floor(e / 60),
        s = e % 60;
      return `${v(n)}:${v(s)}`;
    }
    getPomodoroRecords() {
      return Array.isArray(this.config.pomodoroRecords) ? this.config.pomodoroRecords : ((this.config.pomodoroRecords = []), this.config.pomodoroRecords);
    }
    savePomodoroRecords() {
      const t = this.saveData(a, this.config);
      t && "function" == typeof t.catch && t.catch((t) => console.warn("save pomodoro records failed", t));
    }
    defaultImportantDaysState() {
      return {
        version: 1,
        updatedAt: new Date().toISOString(),
        settings: {
          keyword: "",
          showArchived: false,
          activeTab: "all",
          sort: "smart",
        },
        events: [],
      };
    }
    normalizeImportantDaysSettings(t = {}) {
      const e = ["all", "countdown", "countup", "anniversary", "elapsed"].includes(t.activeTab)
          ? t.activeTab
          : "all",
        n = ["smart", "date-asc", "date-desc", "created-desc"].includes(t.sort)
          ? t.sort
          : "smart";
      return {
        keyword: String(t.keyword || ""),
        showArchived: Boolean(t.showArchived),
        activeTab: e,
        sort: n,
      };
    }
    generateImportantDayId() {
      return "undefined" != typeof crypto && "function" == typeof crypto.randomUUID
        ? crypto.randomUUID()
        : `day-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    parseImportantDayLocalDate(t) {
      if (t instanceof Date && !Number.isNaN(t.getTime()))
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
      const e = String(t || "").trim(),
        n = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!n) return null;
      const s = Number(n[1]),
        a = Number(n[2]),
        i = Number(n[3]),
        o = new Date(s, a - 1, i);
      return o.getFullYear() === s && o.getMonth() === a - 1 && o.getDate() === i ? o : null;
    }
    normalizeImportantDayDate(t) {
      const e = this.parseImportantDayLocalDate(t);
      return e ? p(e) : p(new Date());
    }
    daysBetweenLocal(t, e) {
      const n = this.parseImportantDayLocalDate(t),
        s = this.parseImportantDayLocalDate(e);
      return n && s ? Math.round((n.getTime() - s.getTime()) / 864e5) : 0;
    }
    makeImportantDayLocalDate(t, e, n) {
      const s = new Date(t, e, 1),
        a = new Date(t, e + 1, 0).getDate();
      return (s.setDate(Math.min(n, a)), s);
    }
    getImportantDayThemeNames() {
      return [
        "blue",
        "sky",
        "cyan",
        "teal",
        "green",
        "emerald",
        "lime",
        "yellow",
        "amber",
        "orange",
        "red",
        "rose",
        "pink",
        "fuchsia",
        "purple",
        "violet",
        "indigo",
        "slate",
        "gray",
        "stone",
        "brown",
      ];
    }
    normalizeImportantDay(t = {}) {
      const e = new Date().toISOString(),
        n = ["countdown", "countup", "anniversary", "elapsed"].includes(t.mode) ? t.mode : "countdown",
        s = this.getImportantDayThemeNames().includes(t.theme)
          ? t.theme
          : "blue";
      return {
        id: String(t.id || "").trim() || this.generateImportantDayId(),
        title: String(t.title || "").trim() || "未命名日子",
        date: this.normalizeImportantDayDate(t.date),
        mode: n,
        theme: s,
        category: String(t.category || "").trim(),
        note: String(t.note || "").trim(),
        pinned: Boolean(t.pinned),
        archived: Boolean(t.archived),
        notify: Boolean(t.notify),
        hideYear: Boolean(t.hideYear),
        source: String(t.source || "").trim(),
        createdAt: String(t.createdAt || t.created || e),
        updatedAt: String(t.updatedAt || t.updated || e),
      };
    }
    async loadImportantDays() {
      const t = await this.loadData(IMPORTANT_DAYS_STORAGE_NAME).catch(() => null),
        e = this.defaultImportantDaysState(),
        n = t && "object" == typeof t ? t : {};
      this.importantDaysState = {
        version: 1,
        updatedAt: String(n.updatedAt || e.updatedAt),
        settings: this.normalizeImportantDaysSettings(n.settings || {}),
        events: Array.isArray(n.events) ? n.events.map((t) => this.normalizeImportantDay(t)) : [],
      };
      return this.importantDaysState;
    }
    async saveImportantDays() {
      const t = this.importantDaysState || this.defaultImportantDaysState(),
        e = {
          version: 1,
          updatedAt: new Date().toISOString(),
          settings: this.normalizeImportantDaysSettings(t.settings || {}),
          events: Array.isArray(t.events) ? t.events.map((t) => this.normalizeImportantDay(t)) : [],
        };
      return ((this.importantDaysState = e), await this.saveData(IMPORTANT_DAYS_STORAGE_NAME, e), e);
    }
    getImportantDayNextAnniversary(t, e) {
      const n = this.parseImportantDayLocalDate(t.date),
        s = this.parseImportantDayLocalDate(e || new Date());
      if (!n || !s) return null;
      let a = this.makeImportantDayLocalDate(s.getFullYear(), n.getMonth(), n.getDate());
      return a < s && (a = this.makeImportantDayLocalDate(s.getFullYear() + 1, n.getMonth(), n.getDate())), a;
    }
    getImportantDayAgeText(t, e) {
      const n = this.parseImportantDayLocalDate(t.date),
        s = this.parseImportantDayLocalDate(e || new Date());
      if (!n || !s) return "日期无效";
      if (n > s) return `还有 ${this.daysBetweenLocal(n, s)} 天开始`;
      let a = s.getFullYear() - n.getFullYear(),
        i = s.getMonth() - n.getMonth(),
        o = s.getDate() - n.getDate();
      if (o < 0) {
        const t = new Date(s.getFullYear(), s.getMonth(), 0).getDate();
        ((o += t), i--);
      }
      return i < 0 && (i += 12, a--), `${Math.max(0, a)} 年 ${Math.max(0, i)} 个月 ${Math.max(0, o)} 天`;
    }
    calcImportantDayInfo(t, e = new Date()) {
      const n = this.normalizeImportantDay(t),
        s = this.parseImportantDayLocalDate(e),
        a = this.parseImportantDayLocalDate(n.date),
        i = this.daysBetweenLocal(a, s);
      let o = "",
        r = i;
      if ("countup" === n.mode)
        o = i <= 0 ? `第 ${Math.abs(i) + 1} 天` : `还有 ${i} 天开始`;
      else if ("anniversary" === n.mode) {
        if (n.hideYear) {
          const t = this.getImportantDayNextAnniversary(n, s);
          r = t ? this.daysBetweenLocal(t, s) : i;
          o = 0 === r ? "就是今天" : `还有 ${r} 天`;
        } else o = this.getImportantDayAgeText(n, s);
      } else
        o = 0 === i ? "就是今天" : i > 0 ? `还有 ${i} 天` : `已过去 ${Math.abs(i)} 天`;
      return {
        days: i,
        sortDays: r,
        text: o,
        status: this.getImportantDayStatus(n, s),
      };
    }
    getImportantDayStatus(t, e = new Date()) {
      const n = this.normalizeImportantDay(t);
      if (n.archived) return "archived";
      const s = this.parseImportantDayLocalDate(e),
        a = this.parseImportantDayLocalDate(n.date),
        i = this.daysBetweenLocal(a, s);
      if (0 === i) return "today";
      if ("countup" === n.mode && i < 0) return "running";
      if ("anniversary" === n.mode && n.hideYear) {
        const t = this.getImportantDayNextAnniversary(n, s),
          e = t ? this.daysBetweenLocal(t, s) : i;
        return e <= 7 ? "soon" : "upcoming";
      }
      return i > 0 ? (i <= 7 ? "soon" : "upcoming") : "past";
    }
    getImportantDaySearchText(t) {
      return [t.title, t.category, t.note].map((t) => String(t || "").toLowerCase()).join("\n");
    }
    sortImportantDays(t) {
      const e = this.normalizeImportantDaysSettings(this.importantDaysState?.settings || {}),
        s = this.parseImportantDayLocalDate(new Date()),
        a = (t) => this.parseImportantDayLocalDate(t.date)?.getTime() || 0,
        i = (t) => Date.parse(t.updatedAt || "") || 0,
        o = (t) => Date.parse(t.createdAt || "") || 0,
        r = (t) => this.calcImportantDayInfo(t, s);
      return [...t].sort((t, n) => {
        if ("date-asc" === e.sort) return a(t) - a(n) || i(n) - i(t);
        if ("date-desc" === e.sort) return a(n) - a(t) || i(n) - i(t);
        if ("created-desc" === e.sort) return o(n) - o(t) || i(n) - i(t);
        if (t.pinned !== n.pinned) return t.pinned ? -1 : 1;
        if (t.archived !== n.archived) return t.archived ? 1 : -1;
        const s = r(t),
          a = r(n),
          c = { today: 0, soon: 1, upcoming: 2, running: 3, past: 4, archived: 9 };
        return (c[s.status] ?? 5) - (c[a.status] ?? 5) || Math.abs(s.sortDays) - Math.abs(a.sortDays) || i(n) - i(t);
      });
    }
    filterImportantDays(t, e = this.importantDaysState?.settings || {}) {
      const n = this.normalizeImportantDaysSettings(e),
        s = n.keyword.trim().toLowerCase();
      return (Array.isArray(t) ? t : []).filter((t) => {
        if (!n.showArchived && t.archived) return false;
        if ("all" !== n.activeTab && t.mode !== n.activeTab) return false;
        return !s || this.getImportantDaySearchText(t).includes(s);
      });
    }
    getImportantDayModeLabel(t) {
      return { countdown: "倒数日", countup: "正向日", anniversary: "纪念日", elapsed: "已过天数" }[t] || "倒数日";
    }
    getImportantDayStatusLabel(t) {
      return { today: "今天", soon: "7 天内", upcoming: "即将到来", running: "进行中", past: "已过去", archived: "已归档" }[t] || "";
    }
    getImportantDayTheme(t) {
      return {
        blue: { bg: "#e0f2fe", color: "#0284c7", text: "#075985" },
        sky: { bg: "#e0f7ff", color: "#38bdf8", text: "#075985" },
        cyan: { bg: "#cffafe", color: "#06b6d4", text: "#155e75" },
        teal: { bg: "#ccfbf1", color: "#14b8a6", text: "#115e59" },
        green: { bg: "#dcfce7", color: "#22c55e", text: "#166534" },
        emerald: { bg: "#d1fae5", color: "#10b981", text: "#065f46" },
        lime: { bg: "#ecfccb", color: "#84cc16", text: "#3f6212" },
        yellow: { bg: "#fef9c3", color: "#eab308", text: "#854d0e" },
        amber: { bg: "#fef3c7", color: "#f59e0b", text: "#92400e" },
        orange: { bg: "#ffedd5", color: "#f97316", text: "#9a3412" },
        red: { bg: "#fee2e2", color: "#ef4444", text: "#991b1b" },
        rose: { bg: "#ffe4e6", color: "#fb7185", text: "#9f1239" },
        pink: { bg: "#fce7f3", color: "#ec4899", text: "#9d174d" },
        fuchsia: { bg: "#fae8ff", color: "#d946ef", text: "#86198f" },
        purple: { bg: "#f3e8ff", color: "#a855f7", text: "#6b21a8" },
        violet: { bg: "#ede9fe", color: "#8b5cf6", text: "#5b21b6" },
        indigo: { bg: "#e0e7ff", color: "#6366f1", text: "#3730a3" },
        slate: { bg: "#f1f5f9", color: "#64748b", text: "#334155" },
        gray: { bg: "#f1f5f9", color: "#64748b", text: "#334155" },
        stone: { bg: "#f5f5f4", color: "#78716c", text: "#44403c" },
        brown: { bg: "#fef3c7", color: "#a16207", text: "#713f12" },
      }[t] || { bg: "#e0f2fe", color: "#0284c7", text: "#075985" };
    }
    renderImportantDaysView() {
      const t = this.rootElement?.querySelector(".stbc-calendar-panel") || this.rootElement?.querySelector(".stbc-main");
      if (!t) return;
      const e = this.importantDaysState || this.defaultImportantDaysState(),
        n = this.normalizeImportantDaysSettings(e.settings || {}),
        s = e.events || [],
        a = this.parseImportantDayLocalDate(new Date()),
        i = this.sortImportantDays(this.filterImportantDays(s, n)),
        o = s.filter((t) => !t.archived),
        r = {
          all: o.length,
          countdown: o.filter((t) => "countdown" === t.mode).length,
          countup: o.filter((t) => "countup" === t.mode).length,
          anniversary: o.filter((t) => "anniversary" === t.mode).length,
          soon: o.filter((t) => ["today", "soon"].includes(this.getImportantDayStatus(t, a))).length,
        },
        c = [
          ["all", "全部"],
          ["countdown", "倒数日"],
          ["countup", "正向日"],
          ["anniversary", "纪念日"],
          ["elapsed", "已过天数"],
        ],
        l = i
          .map((t) => {
            const e = this.calcImportantDayInfo(t, a),
              n = this.getImportantDayTheme(t.theme);
            return `
              <article class="stbc-days-card is-${y(t.theme)} is-${y(e.status)} ${t.archived ? "is-archived" : ""}" data-id="${y(t.id)}" style="--stbc-days-color:${n.color};--stbc-days-bg:${n.bg};--stbc-days-text:${n.text};">
                <div class="stbc-days-card-main">
                  <div class="stbc-days-card-title-row">
                    <h3>${y(t.title)}</h3>
                    ${t.pinned ? '<span class="stbc-days-badge">置顶</span>' : ""}
                    ${t.archived ? '<span class="stbc-days-badge stbc-days-badge--muted">归档</span>' : ""}
                  </div>
                  <div class="stbc-days-card-meta">
                    <span>${y(t.date)}</span>
                    <span>${y(this.getImportantDayModeLabel(t.mode))}</span>
                    ${t.category ? `<span>${y(t.category)}</span>` : ""}
                    <span>${y(this.getImportantDayStatusLabel(e.status))}</span>
                  </div>
                  ${t.note ? `<p class="stbc-days-note">${y(t.note)}</p>` : ""}
                </div>
                <div class="stbc-days-count">
                  <strong>${y(e.text)}</strong>
                  <span>${y(t.notify ? "已开启提醒" : "本地 JSON")}</span>
                </div>
                <div class="stbc-days-card-actions">
                  <button class="stbc-icon-button" data-action="important-days-pin" type="button" title="${t.pinned ? "取消置顶" : "置顶"}" aria-label="${t.pinned ? "取消置顶" : "置顶"}">${t.pinned ? "★" : "☆"}</button>
                  <button class="stbc-button" data-action="important-days-edit" type="button">编辑</button>
                  <button class="stbc-button" data-action="important-days-archive" type="button">${t.archived ? "取消归档" : "归档"}</button>
                  <button class="stbc-button stbc-days-danger" data-action="important-days-delete" type="button">删除</button>
                </div>
              </article>
            `;
          })
          .join("");
      t.innerHTML = `
        <section class="stbc-days-view">
          <header class="stbc-days-header">
            <div>
              <div class="stbc-days-kicker">${p(a)} 统计</div>
              <h2 class="stbc-days-title">倒数日</h2>
              <p>管理考试、纪念日、正向日和重要日期节点</p>
            </div>
            <div class="stbc-days-actions">
              <button class="stbc-button" data-action="important-days-new" type="button">新增日期</button>
              <button class="stbc-button" data-action="important-days-import" type="button">导入旧数据</button>
              <button class="stbc-button" data-action="important-days-export" type="button">导出 JSON</button>
            </div>
          </header>
          <div class="stbc-days-stats">
            <div class="stbc-days-stat-card"><span>全部项目</span><strong>${r.all}</strong></div>
            <div class="stbc-days-stat-card"><span>倒数日</span><strong>${r.countdown}</strong></div>
            <div class="stbc-days-stat-card"><span>正向日</span><strong>${r.countup}</strong></div>
            <div class="stbc-days-stat-card"><span>纪念日</span><strong>${r.anniversary}</strong></div>
            <div class="stbc-days-stat-card"><span>7 天内</span><strong>${r.soon}</strong></div>
          </div>
          <div class="stbc-days-toolbar">
            <label class="stbc-days-search">
              <span>搜索</span>
              <input class="b3-text-field" data-action="important-days-search" type="search" value="${y(n.keyword)}" placeholder="搜索标题、分类、备注" />
            </label>
            <div class="stbc-days-tabs" role="tablist">
              ${c.map(([t, e]) => `<button class="stbc-days-tab ${n.activeTab === t ? "is-active" : ""}" data-action="important-days-tab" data-tab="${t}" type="button">${e}</button>`).join("")}
            </div>
            <label class="stbc-days-switch"><input data-action="important-days-toggle-archived" type="checkbox" ${n.showArchived ? "checked" : ""} /> 显示归档</label>
            <select class="stbc-select" data-action="important-days-sort" aria-label="倒数日排序">
              <option value="smart" ${"smart" === n.sort ? "selected" : ""}>智能排序</option>
              <option value="date-asc" ${"date-asc" === n.sort ? "selected" : ""}>日期升序</option>
              <option value="date-desc" ${"date-desc" === n.sort ? "selected" : ""}>日期降序</option>
              <option value="created-desc" ${"created-desc" === n.sort ? "selected" : ""}>创建时间倒序</option>
            </select>
          </div>
          <div class="stbc-days-list">
            ${l || '<div class="stbc-days-empty">还没有匹配的日期。可以新增日期，或导入旧 important-days JSON。</div>'}
          </div>
        </section>
      `;
      this.bindImportantDaysView(t);
    }
    bindImportantDaysView(t) {
      if ("important-days" !== this.viewMode) return;
      t.querySelector('[data-action="important-days-new"]')?.addEventListener("click", () => this.openImportantDayDialog());
      t.querySelector('[data-action="important-days-import"]')?.addEventListener("click", () => this.importImportantDaysFromFile());
      t.querySelector('[data-action="important-days-export"]')?.addEventListener("click", () => this.exportImportantDays());
      t.querySelector('[data-action="important-days-search"]')?.addEventListener("input", async (t) => {
        this.importantDaysState.settings.keyword = t.currentTarget.value || "";
        await this.saveImportantDays();
        this.renderImportantDaysView();
        const e = this.rootElement?.querySelector('[data-action="important-days-search"]'),
          n = this.importantDaysState.settings.keyword.length;
        e?.focus();
        e?.setSelectionRange?.(n, n);
      });
      t.querySelectorAll('[data-action="important-days-tab"]').forEach((t) => {
        t.addEventListener("click", async () => {
          this.importantDaysState.settings.activeTab = t.dataset.tab || "all";
          await this.saveImportantDays();
          this.renderImportantDaysView();
        });
      });
      t.querySelector('[data-action="important-days-toggle-archived"]')?.addEventListener("change", async (t) => {
        this.importantDaysState.settings.showArchived = Boolean(t.currentTarget.checked);
        await this.saveImportantDays();
        this.renderImportantDaysView();
      });
      t.querySelector('[data-action="important-days-sort"]')?.addEventListener("change", async (t) => {
        this.importantDaysState.settings.sort = t.currentTarget.value || "smart";
        await this.saveImportantDays();
        this.renderImportantDaysView();
      });
      t.querySelectorAll("[data-action^='important-days-']").forEach((e) => {
        e.addEventListener("click", async (s) => {
          const a = s.currentTarget,
            i = a.closest(".stbc-days-card")?.dataset.id;
          if (!i) return;
          s.preventDefault();
          s.stopPropagation();
          if ("important-days-edit" === a.dataset.action) return void this.openImportantDayDialog(i);
          if ("important-days-pin" === a.dataset.action) return void (await this.toggleImportantDayPinned(i));
          if ("important-days-archive" === a.dataset.action) return void (await this.toggleImportantDayArchived(i));
          if ("important-days-delete" === a.dataset.action) return void (await this.deleteImportantDay(i));
        });
      });
    }
    getImportantDayById(t) {
      return (this.importantDaysState?.events || []).find((e) => String(e.id) === String(t));
    }
    renderImportantDayFormContent(t) {
      const e = this.normalizeImportantDay(t || { date: p(this.currentDate || new Date()) }),
        n = [
          ["countdown", "倒数日"],
          ["countup", "正向日"],
          ["anniversary", "纪念日"],
          ["elapsed", "已过天数"],
        ],
        s = this.getImportantDayThemeNames().map((t) => [
          t,
          {
            blue: "蓝色",
            sky: "天蓝",
            cyan: "青色",
            teal: "蓝绿",
            green: "绿色",
            emerald: "翡翠",
            lime: "青柠",
            yellow: "黄色",
            amber: "琥珀",
            orange: "橙色",
            red: "红色",
            rose: "玫瑰",
            pink: "粉色",
            fuchsia: "洋红",
            purple: "紫色",
            violet: "紫罗兰",
            indigo: "靛蓝",
            slate: "石板",
            gray: "灰色",
            stone: "岩灰",
            brown: "咖啡",
          }[t] || t,
        ]),
        a = s
          .map(([t, n]) => {
            const s = this.getImportantDayTheme(t);
            return `\n            <label class="stbc-color-choice stbc-days-theme-choice" title="${n}">\n              <input type="radio" name="stbc-important-day-theme" value="${t}" ${e.theme === t ? "checked" : ""} />\n              <span style="--stbc-choice-color:${s.color};--stbc-choice-bg:${s.bg};"></span>\n            </label>\n          `;
          })
          .join("");
      return `
        <div class="stbc-form stbc-days-form" data-id="${y(t?.id || "")}">
          <label class="stbc-form-row"><span>标题</span><input class="b3-text-field stbc-days-form-title" value="${y(e.title)}" /></label>
          <label class="stbc-form-row"><span>日期</span><input class="b3-text-field stbc-days-form-date" type="date" value="${y(e.date)}" /></label>
          <label class="stbc-form-row"><span>类型</span><select class="b3-text-field stbc-days-form-mode">${n.map(([t, n]) => `<option value="${t}" ${e.mode === t ? "selected" : ""}>${n}</option>`).join("")}</select></label>
          <label class="stbc-form-row"><span>分类</span><input class="b3-text-field stbc-days-form-category" value="${y(e.category)}" placeholder="考试 / 生日 / 纪念日" /></label>
          <div class="stbc-form-row">
            <span>主题</span>
            <div class="stbc-color-grid stbc-days-theme-grid">${a}</div>
          </div>
          <label class="stbc-form-row stbc-label-row"><span>备注</span><textarea class="b3-text-field stbc-days-form-note" rows="3">${y(e.note)}</textarea></label>
          <div class="stbc-days-form-checks">
            <label><input class="stbc-days-form-pinned" type="checkbox" ${e.pinned ? "checked" : ""} /> 置顶</label>
            <label><input class="stbc-days-form-archived" type="checkbox" ${e.archived ? "checked" : ""} /> 归档</label>
            <label><input class="stbc-days-form-notify" type="checkbox" ${e.notify ? "checked" : ""} /> 提醒</label>
            <label><input class="stbc-days-form-hide-year" type="checkbox" ${e.hideYear ? "checked" : ""} /> 隐藏年份</label>
          </div>
          <div class="stbc-form-actions">
            <button class="b3-button b3-button--cancel" data-action="important-days-cancel" type="button">取消</button>
            <button class="b3-button b3-button--text" data-action="important-days-save" type="button">保存</button>
          </div>
        </div>
      `;
    }
    openImportantDayDialog(t) {
      const e = "string" == typeof t ? this.getImportantDayById(t) : t,
        s = new n.Dialog({
          title: e ? "编辑日期" : "新增日期",
          content: this.renderImportantDayFormContent(e),
          width: "520px",
        }),
        a = s.element,
        i = a.querySelector(".stbc-days-form");
      (a?.classList.add("stbc-glass-dialog"),
        a?.querySelector(".b3-dialog__close")?.addEventListener("click", (t) => { t.preventDefault(); t.stopPropagation(); s.destroy(); }, { capture: true }),
        i?.querySelector('[data-action="important-days-cancel"]')?.addEventListener("click", () => s.destroy()),
        i?.querySelector('[data-action="important-days-save"]')?.addEventListener("click", async () => {
          try {
            const t = this.readImportantDayForm(i, e);
            if (!t.title.trim()) return void (0, n.showMessage)("标题不能为空");
            if (!this.parseImportantDayLocalDate(t.date)) return void (0, n.showMessage)("日期必须是合法 YYYY-MM-DD");
            if (!["countdown", "countup", "anniversary", "elapsed"].includes(t.mode)) return void (0, n.showMessage)("类型不合法");
            await this.upsertImportantDay(t);
            (s.destroy(), this.renderImportantDaysView(), (0, n.showMessage)(e ? "日期已更新" : "日期已新增"));
          } catch (t) {
            (console.error("save important day failed", t), (0, n.showMessage)(`保存失败：${t instanceof Error ? t.message : String(t)}`));
          }
        }));
    }
    readImportantDayForm(t, e) {
      const n = new Date().toISOString();
      return {
        id: e?.id || this.generateImportantDayId(),
        title: String(t.querySelector(".stbc-days-form-title")?.value || "").trim(),
        date: String(t.querySelector(".stbc-days-form-date")?.value || "").trim(),
        mode: String(t.querySelector(".stbc-days-form-mode")?.value || "countdown"),
        theme: String(t.querySelector('input[name="stbc-important-day-theme"]:checked')?.value || "blue"),
        category: String(t.querySelector(".stbc-days-form-category")?.value || "").trim(),
        note: String(t.querySelector(".stbc-days-form-note")?.value || "").trim(),
        pinned: Boolean(t.querySelector(".stbc-days-form-pinned")?.checked),
        archived: Boolean(t.querySelector(".stbc-days-form-archived")?.checked),
        notify: Boolean(t.querySelector(".stbc-days-form-notify")?.checked),
        hideYear: Boolean(t.querySelector(".stbc-days-form-hide-year")?.checked),
        source: e?.source || "",
        createdAt: e?.createdAt || n,
        updatedAt: n,
      };
    }
    async upsertImportantDay(t) {
      const e = this.normalizeImportantDay(t),
        n = this.importantDaysState || this.defaultImportantDaysState(),
        s = Array.isArray(n.events) ? n.events : [],
        a = s.findIndex((t) => t.id === e.id);
      this.importantDaysState = { ...n, events: a >= 0 ? s.map((t, n) => (n === a ? e : t)) : [e, ...s] };
      await this.saveImportantDays();
    }
    async toggleImportantDayPinned(t) {
      const e = this.getImportantDayById(t);
      e && (await this.upsertImportantDay({ ...e, pinned: !e.pinned, updatedAt: new Date().toISOString() }), this.renderImportantDaysView());
    }
    async toggleImportantDayArchived(t) {
      const e = this.getImportantDayById(t);
      e && (await this.upsertImportantDay({ ...e, archived: !e.archived, updatedAt: new Date().toISOString() }), this.renderImportantDaysView());
    }
    async deleteImportantDay(t) {
      const e = this.getImportantDayById(t);
      if (!e || !window.confirm(`删除日期“${e.title}”？\n\n只会从倒数日 JSON 数据中移除，不会删除思源文档。`)) return;
      this.importantDaysState.events = (this.importantDaysState.events || []).filter((e) => e.id !== t);
      await this.saveImportantDays();
      this.renderImportantDaysView();
      (0, n.showMessage)("日期已删除");
    }
    normalizeImportantDaysImportObject(t) {
      if (!t || "object" != typeof t) throw new Error("JSON 不是有效对象");
      return Array.isArray(t) ? t : Array.isArray(t.events) ? t.events : [];
    }
    async importImportantDaysObject(t) {
      const e = this.normalizeImportantDaysImportObject(t),
        n = this.importantDaysState || this.defaultImportantDaysState(),
        s = new Set((n.events || []).map((t) => String(t.id || "")).filter(Boolean)),
        a = new Set((n.events || []).map((t) => `${String(t.title || "").toLowerCase()}|${t.date}|${t.mode}`)),
        i = [];
      let o = 0,
        r = 0,
        c = 0;
      for (const t of e) {
        try {
          const e = String(t?.id || "").trim(),
            l = String(t?.title || "未命名日子").trim().toLowerCase(),
            d = this.normalizeImportantDayDate(t?.date),
            h = ["countdown", "countup", "anniversary", "elapsed"].includes(t?.mode) ? t.mode : "countdown",
            m = `${l}|${d}|${h}`;
          if ((e && s.has(e)) || (!e && a.has(m))) {
            r++;
            continue;
          }
          const b = this.normalizeImportantDay({ ...t, id: e || undefined, date: d, mode: h });
          (i.push(b), b.id && s.add(b.id), a.add(m), o++);
        } catch (t) {
          (console.warn("import important day failed", t), c++);
        }
      }
      return ((this.importantDaysState = { ...n, events: [...i, ...(n.events || [])] }), await this.saveImportantDays(), { ok: o, skipped: r, fail: c });
    }
    importImportantDaysFromFile() {
      const t = document.createElement("input");
      ((t.type = "file"),
        (t.accept = ".json,application/json"),
        t.addEventListener("change", async () => {
          const e = t.files?.[0];
          if (!e) return;
          try {
            const t = await this.readTextFile(e),
              s = JSON.parse(t),
              a = await this.importImportantDaysObject(s);
            (this.renderImportantDaysView(), (0, n.showMessage)(`导入完成：成功 ${a.ok} 条，跳过重复 ${a.skipped} 条，失败 ${a.fail} 条`));
          } catch (t) {
            (console.error("import important days failed", t), (0, n.showMessage)(`导入失败：${t instanceof Error ? t.message : String(t)}`));
          }
        }),
        t.click());
    }
    exportImportantDays() {
      const t = this.importantDaysState || this.defaultImportantDaysState(),
        e = { version: 1, updatedAt: new Date().toISOString(), settings: this.normalizeImportantDaysSettings(t.settings || {}), events: t.events || [] },
        s = `time-block-calendar-important-days-${p(new Date())}.json`;
      (this.downloadTextFile(s, JSON.stringify(e, null, 2)), (0, n.showMessage)("倒数日 JSON 已导出"));
    }
    getAiConfig() {
      return {
        aiEnabled: Boolean(this.config.aiEnabled),
        aiBaseURL: String(this.config.aiBaseURL || "").trim(),
        aiApiKey: String(this.config.aiApiKey || "").trim(),
        aiModel: String(this.config.aiModel || "").trim(),
        aiTemperature: Number(this.config.aiTemperature ?? 0.1),
        aiMaxTokens: Number(this.config.aiMaxTokens || 2000),
        aiTimeoutMs: Number(this.config.aiTimeoutMs || 30000),
      };
    }
    validateAiConfig() {
      const t = this.getAiConfig();
      if (!t.aiEnabled) throw new Error("请先在设置中启用 AI 功能");
      if (!t.aiBaseURL) throw new Error("请先填写 API 地址");
      if (!t.aiApiKey) throw new Error("请先填写 API Key");
      if (!t.aiModel) throw new Error("请先填写模型名称");
      return t;
    }
    getAiEndpoint(t) {
      return `${String(t || "").replace(/\/+$/, "")}/chat/completions`;
    }
    maskAiError(t) {
      return String(t || "")
        .replace(/sk-[A-Za-z0-9_\-]{8,}/g, "sk-***")
        .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, "Bearer ***")
        .slice(0, 220);
    }
    buildAiSystemPrompt(t = {}) {
      return `你是一个时间管理插件的自然语言解析器。
你的任务是把用户输入的中文自然语言转换为结构化 JSON。
你只能返回 JSON，不能返回 Markdown，不能返回解释文字。

当前日期是：${t.today || p(new Date())}
当前所在周是：${t.weekRange || ""}
当前插件时区按用户本地时间处理。

你需要识别三类动作：
1. create_time_block，用于创建有明确开始/结束时间的时间块或日程，必须包含 title、date、startTime、endTime。
2. create_all_day_event，用于创建全天事件，必须包含 title、date，不要包含 startTime、endTime。
3. create_important_day，用于创建倒数日、正向日、纪念日、已过天数，必须包含 title、date、mode。

mode 规则：
- 如果用户说“倒数”“还有几天”“考试”“截止”“DDL”，通常用 countdown。
- 如果用户说“从某天开始”“坚持第几天”“已经开始”，通常用 countup。
- 如果用户说“生日”“纪念日”“恋爱纪念日”，通常用 anniversary。
- 如果用户说“已经过去多久”，通常用 elapsed。

日期解析规则：
- “今天” = 当前日期，“明天” = 当前日期 + 1 天，“后天” = 当前日期 + 2 天。
- 没有年份的日期，优先使用当前年份。
- 如果该日期在当前年份已经过去，并且语义明显指未来事件，则使用下一年。
- 必须输出 YYYY-MM-DD，不要使用 UTC，按本地日期理解。

时间解析规则：
- 上午 9 点 = 09:00，下午 2 点 = 14:00，晚上 8 点 = 20:00。
- 如果用户给了开始时间但没给结束时间，默认持续 60 分钟，并在 note 中说明“AI 默认时长 60 分钟”。
- 如果没有明确开始时间，不要创建 create_time_block，可以改为 questions 询问。
- 如果用户明确说“全天事件”“全日事件”“整天”“全天”，必须创建 create_all_day_event，不要创建 00:00-23:59 的 create_time_block。
- 如果用户说“6.8-6.30 每天各创建一个 X 的全天事件”这类日期范围每天重复，请返回 1 个 create_all_day_event，并设置 date 为开始日期、endDate 为结束日期、repeat 为 daily；不要把它当成一个持续 23 天的单个事件。
- 如果只有日期没有具体时间，且不是全天事件，更适合 create_important_day。

分类推断：
- 六级、英语、单词、翻译、作文 -> 英语 / 考试
- 考研、线代、高数、概率论、政治、专业课 -> 考研
- 微机电、嵌入式、传感器、ARM -> 课程
- 生日 -> 生日
- 恋爱、纪念 -> 恋爱 / 纪念日
- 没有明确分类时 category 为空字符串。

输出要求：
- 只返回合法 JSON。
- actions 最多返回 60 条。
- 每个 action 都要有 confidence，范围 0 到 1。
- 不确定的信息不要编造，放到 questions 中。
- 不要直接说创建成功，因为你只是解析器。

JSON 格式：
{"summary":"识别到 1 个待创建项目","needConfirm":true,"actions":[{"type":"create_time_block","title":"背单词","date":"2026-06-06","startTime":"09:00","endTime":"11:00","category":"英语","note":"","sourceText":"明天上午9点到11点背单词","confidence":0.92}],"questions":[]}
全天事件示例：
{"summary":"识别到 23 个全天事件","needConfirm":true,"actions":[{"type":"create_all_day_event","title":"❌","date":"2026-06-08","endDate":"2026-06-30","repeat":"daily","category":"","note":"","sourceText":"6.8-6.30 每天各创建一个❌的全天事件","confidence":0.95}],"questions":[]}`;
    }
    async requestAiChat(t, e = {}) {
      const s = this.validateAiConfig(),
        a = new AbortController(),
        i = window.setTimeout(() => a.abort(), Math.max(5000, s.aiTimeoutMs || 30000));
      try {
        const o = await fetch(this.getAiEndpoint(s.aiBaseURL), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${s.aiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: s.aiModel,
            temperature: Number.isFinite(s.aiTemperature) ? s.aiTemperature : 0.1,
            max_tokens: Math.max(1, Number(e.maxTokens || s.aiMaxTokens || 2000)),
            messages: t,
          }),
          signal: a.signal,
        });
        const r = await o.text();
        if (!o.ok) throw new Error(`HTTP ${o.status} ${r ? r.slice(0, 120) : ""}`);
        const c = JSON.parse(r);
        return c?.choices?.[0]?.message?.content ?? c?.choices?.[0]?.text ?? "";
      } catch (t) {
        if ("AbortError" === t?.name) throw new Error("AI 请求超时");
        throw new Error(this.maskAiError(t instanceof Error ? t.message : String(t)) || "AI 请求失败，请检查网络或 API 配置");
      } finally {
        window.clearTimeout(i);
      }
    }
    async testAiConnection() {
      await this.requestAiChat(
        [
          { role: "system", content: '只返回 {"ok":true}' },
          { role: "user", content: "ping" },
        ],
        { maxTokens: 16 },
      );
    }
    extractJsonObject(t) {
      const e = String(t || "").trim();
      if (!e) throw new Error("AI 返回格式不正确，请重试");
      try {
        return JSON.parse(e);
      } catch (t) {}
      let n = -1,
        s = 0,
        a = !1,
        i = !1;
      for (let o = 0; o < e.length; o++) {
        const r = e[o];
        if (i) {
          i = !1;
          continue;
        }
        if ("\\" === r && a) {
          i = !0;
          continue;
        }
        if ('"' === r) {
          a = !a;
          continue;
        }
        if (a) continue;
        if ("{" === r) {
          0 === s && (n = o);
          s++;
        } else if ("}" === r && s > 0) {
          s--;
          if (0 === s && n >= 0) return JSON.parse(e.slice(n, o + 1));
        }
      }
      throw new Error("AI 返回格式不正确，请重试");
    }
    async callAiParser(t) {
      const e = new Date(),
        n = b(e),
        s = m(n, 6),
        a = this.buildAiSystemPrompt({ today: p(e), weekRange: `${p(n)} 至 ${p(s)}` }),
        i = await this.requestAiChat([
          { role: "system", content: a },
          { role: "user", content: String(t || "") },
        ]);
      return this.extractJsonObject(i);
    }
    isValidAiDate(t) {
      return Boolean(this.parseImportantDayLocalDate(t));
    }
    isValidAiTime(t) {
      return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ""));
    }
    aiTimeToMinutes(t) {
      const e = String(t || "").match(/^(\d{2}):(\d{2})$/);
      return e ? 60 * Number(e[1]) + Number(e[2]) : NaN;
    }
    isAiAllDayActionType(t) {
      return ["create_all_day_event", "create_all_day", "create_all_day_block", "create_full_day_event"].includes(String(t || ""));
    }
    normalizeAiActionType(t = {}) {
      const e = String(t?.type || "").trim(),
        n = `${t?.sourceText || ""} ${t?.title || ""} ${t?.note || ""}`,
        s = /全天|全日|整天|all[-\s]?day/i.test(n),
        a = /全天|全日|整天|all[-\s]?day/i.test(String(this.aiLastInputText || "")),
        i = String(t?.startTime || "").trim(),
        o = String(t?.endTime || "").trim(),
        r = Boolean(i || o),
        c = "00:00" === i && ["23:59", "24:00", "00:00"].includes(o),
        l = !0 === t?.allDay || /^(true|1|yes|y|是)$/i.test(String(t?.allDay || "")) || s || (a && (!r || c));
      if (this.isAiAllDayActionType(e)) return "create_all_day_event";
      if (l && "create_time_block" === e) return "create_all_day_event";
      return e;
    }
    isAiCalendarEventAction(t) {
      return "create_time_block" === t?.type || "create_all_day_event" === t?.type;
    }
    getAiDateRangeDays(t, e) {
      const n = this.parseImportantDayLocalDate(t),
        s = this.parseImportantDayLocalDate(e);
      if (!n || !s) return 1;
      if (s < n) return 0;
      return Math.max(1, Math.round((s.getTime() - n.getTime()) / 864e5) + 1);
    }
    shouldExpandAiAllDayRange(t = {}) {
      const e = `${t.repeat || ""} ${t.recurrence || ""} ${t.frequency || ""}`.toLowerCase(),
        n = `${t.sourceText || ""} ${this.aiLastInputText || ""}`;
      return !0 === t.eachDay || !0 === t.everyDay || e.includes("daily") || e.includes("day") || /每天|每日|每一天|逐日|各创建/.test(n);
    }
    expandAiRawActions(t = []) {
      const e = [];
      for (const n of t) {
        if (e.length >= 60) break;
        const s = n && "object" == typeof n ? n : {},
          a = this.normalizeAiActionType(s),
          i = String(s.date || s.startDate || s.beginDate || "").trim(),
          o = String(s.endDate || s.dateEnd || s.until || s.finishDate || "").trim();
        if ("create_all_day_event" === a && i && o && this.shouldExpandAiAllDayRange(s) && this.isValidAiDate(i) && this.isValidAiDate(o)) {
          const t = this.parseImportantDayLocalDate(i),
            n = Math.min(60 - e.length, this.getAiDateRangeDays(i, o));
          for (let i = 0; i < n; i++)
            e.push({ ...s, type: "create_all_day_event", date: p(m(t, i)), endDate: "", repeat: "", sourceText: s.sourceText || this.aiLastInputText || "" });
          continue;
        }
        e.push({ ...s, type: a, date: i || String(s.date || "").trim(), endDate: o });
      }
      return e.slice(0, 60);
    }
    getAiActionTypeLabel(t) {
      if ("create_time_block" === t.type) return "时间块";
      if ("create_all_day_event" === t.type) return "全天事件";
      const e = { countdown: "倒数日", countup: "正向日", anniversary: "纪念日", elapsed: "已过天数" };
      return e[t.mode] || "倒数日";
    }
    normalizeAiConfidence(t) {
      const e = Number(t);
      return Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0.8;
    }
    validateAiActions(t) {
      if (!t || "object" != typeof t || Array.isArray(t)) throw new Error("AI 返回格式不正确，请重试");
      const rawActions = Array.isArray(t.actions) ? t.actions : [],
        e = this.expandAiRawActions(rawActions),
        n = Array.isArray(t.questions) ? t.questions.map((t) => String(t || "").trim()).filter(Boolean) : [],
        s = e.map((t, e) => {
          const s = t && "object" == typeof t ? t : {},
            a = [],
            i = [],
            o = this.normalizeAiActionType(s),
            r = {
              index: e,
              raw: s,
              type: o,
              title: this.safeBlockText(s.title || ""),
              date: String(s.date || s.startDate || s.beginDate || "").trim(),
              endDate: String(s.endDate || s.dateEnd || s.until || s.finishDate || "").trim(),
              startTime: String(s.startTime || "").trim(),
              endTime: String(s.endTime || "").trim(),
              mode: String(s.mode || "").trim(),
              category: String(s.category || "").trim(),
              color: this.normalizeImportColor(s.color || s.eventColor || "", String(s.category || "").trim()),
              theme: String(s.theme || "blue").trim(),
              note: String(s.note || "").trim(),
              sourceText: String(s.sourceText || "").trim(),
              confidence: this.normalizeAiConfidence(s.confidence),
              valid: !0,
              selected: !0,
              warnings: i,
              errors: a,
            };
          if ("create_time_block" === o) {
            if (!r.title) a.push("缺少标题");
            if (!this.isValidAiDate(r.date)) a.push("日期必须是 YYYY-MM-DD");
            if (!this.isValidAiTime(r.startTime)) a.push("开始时间必须是 HH:mm");
            if (!this.isValidAiTime(r.endTime)) a.push("结束时间必须是 HH:mm");
            const t = this.aiTimeToMinutes(r.startTime),
              e = this.aiTimeToMinutes(r.endTime);
            if (!Number.isNaN(t) && !Number.isNaN(e) && e <= t) a.push("结束时间必须晚于开始时间");
          } else if ("create_all_day_event" === o) {
            if (!r.title) a.push("缺少标题");
            if (!this.isValidAiDate(r.date)) a.push("日期必须是 YYYY-MM-DD");
            if (r.endDate) {
              if (!this.isValidAiDate(r.endDate)) a.push("结束日期必须是 YYYY-MM-DD");
              else if (this.getAiDateRangeDays(r.date, r.endDate) < 1) a.push("结束日期必须不早于开始日期");
            }
          } else if ("create_important_day" === o) {
            if (!r.title) a.push("缺少标题");
            if (!this.isValidAiDate(r.date)) a.push("日期必须是 YYYY-MM-DD");
            if (!["countdown", "countup", "anniversary", "elapsed"].includes(r.mode)) a.push("类型必须是 countdown / countup / anniversary / elapsed");
            if (!["blue", "green", "red", "orange", "pink", "indigo", "lime", "cyan", "gray"].includes(r.theme)) r.theme = "blue";
          } else a.push("不支持的 action.type");
          r.confidence < 0.7 && i.push("识别置信度较低，请确认");
          this.addAiConflictWarnings(r);
          r.valid = 0 === a.length;
          r.selected = r.valid && !i.includes("可能重复");
          return r;
        });
      return {
        summary: String(rawActions.length !== s.length || !t.summary ? (s.length ? `识别到 ${s.length} 个待创建项目` : "没有识别到可创建的时间项目") : t.summary),
        needConfirm: !1 !== t.needConfirm,
        questions: n,
        actions: s,
      };
    }
    addAiConflictWarnings(t) {
      if ("create_time_block" === t.type && this.isValidAiDate(t.date) && this.isValidAiTime(t.startTime) && this.isValidAiTime(t.endTime)) {
        const e = this.aiTimeToMinutes(t.startTime),
          n = this.aiTimeToMinutes(t.endTime),
          s = (this.events || []).find((s) => p(s.start) === t.date && !s.allDay && this.aiTimeToMinutes(f(s.start)) < n && this.aiTimeToMinutes(f(s.end)) > e);
        s && t.warnings.push(`可能与“${s.title || "已有时间块"}”发生时间冲突`);
      }
      if ("create_all_day_event" === t.type && this.isValidAiDate(t.date)) {
        const e = this.parseImportantDayLocalDate(t.date),
          n = m(e, this.getAiDateRangeDays(t.date, t.endDate || t.date)),
          s = (this.events || []).some((s) => s.allDay && String(s.title || "").trim() === t.title && s.start < n && s.end > e);
        s && t.warnings.push("可能重复");
      }
      if ("create_important_day" === t.type && this.isValidAiDate(t.date)) {
        const e = (this.importantDaysState?.events || []).some((e) => String(e.title || "").trim() === t.title && e.date === t.date && e.mode === t.mode);
        e && t.warnings.push("可能重复");
      }
    }
    renderAiActionColorPickerHTML(t) {
      if (!t || !this.isAiCalendarEventAction(t) || !t.valid) return "";
      const e = this.normalizeImportColor(t.color || "", t.category || ""),
        n = `stbc-ai-action-color-${t.index}`,
        s = r
          .map((s) => `
            <label class="stbc-color-choice stbc-ai-color-choice" title="${y(s.name)}">
              <input data-action="ai-color-select" data-index="${y(String(t.index ?? ""))}" type="radio" name="${y(n)}" value="${y(s.value)}" ${s.value === e ? "checked" : ""} />
              <span style="--stbc-choice-color:${y(s.value)};--stbc-choice-bg:${y(s.bg)};"></span>
            </label>
          `)
          .join("");
      return `
        <div class="stbc-ai-color-picker">
          <span>颜色</span>
          <div class="stbc-color-grid stbc-ai-color-grid">${s}</div>
        </div>
      `;
    }
    renderAiPreviewHTML(t) {
      const e = t?.actions || [],
        n = t?.questions || [],
        s = e
          .map((t) => {
            const e = t.valid ? t.warnings.length ? "stbc-ai-preview-card-warning" : "" : "stbc-ai-preview-card-error",
              n = t.warnings.concat(t.errors).map((t) => `<li>${y(t)}</li>`).join("");
            return `
              <article class="stbc-ai-preview-card ${e}" data-index="${t.index}" style="${this.isAiCalendarEventAction(t) ? `--stbc-ai-action-color:${y(this.normalizeImportColor(t.color || "", t.category || ""))};` : ""}">
                <label class="stbc-ai-preview-check">
                  <input data-action="ai-toggle-action" data-index="${t.index}" type="checkbox" ${t.selected ? "checked" : ""} ${t.valid ? "" : "disabled"} />
                  <span>${y(t.valid ? this.getAiActionTypeLabel(t) : "无法创建")}</span>
                </label>
                <div class="stbc-ai-preview-main">
                  <h4>${y(t.title || "未命名")}</h4>
                  <div class="stbc-ai-preview-meta">
                    <span>${y(t.date || "缺少日期")}</span>
                    ${"create_time_block" === t.type ? `<span>${y(t.startTime || "--:--")} - ${y(t.endTime || "--:--")}</span>` : "create_all_day_event" === t.type ? `<span>${y(t.endDate ? `全天 · 至 ${t.endDate}` : "全天")}</span>` : `<span>${y(this.getAiActionTypeLabel(t))}</span>`}
                    ${t.category ? `<span>${y(t.category)}</span>` : ""}
                    <span class="stbc-ai-confidence">置信度 ${Math.round(100 * t.confidence)}%</span>
                  </div>
                  ${this.isAiCalendarEventAction(t) ? this.renderAiActionColorPickerHTML(t) : ""}
                  ${t.note ? `<p>${y(t.note)}</p>` : ""}
                  ${t.sourceText ? `<div class="stbc-ai-source">原文：${y(t.sourceText)}</div>` : ""}
                  ${n ? `<ul class="stbc-ai-warning-list">${n}</ul>` : ""}
                </div>
              </article>
            `;
          })
          .join("");
      return `
        <div class="stbc-ai-preview-head">
          <strong>${y(t?.summary || "")}</strong>
          <span>请确认后再创建，AI 不会直接写入数据。</span>
        </div>
        ${n.length ? `<ul class="stbc-ai-question-list">${n.map((t) => `<li>${y(t)}</li>`).join("")}</ul>` : ""}
        <div class="stbc-ai-preview-list">${s || '<div class="stbc-ai-empty">没有识别到可创建的时间项目。</div>'}</div>
        <div class="stbc-ai-actions">
          <button class="b3-button b3-button--text" data-action="ai-create-selected" type="button" ${e.some((t) => t.valid) ? "" : "disabled"}>创建选中项</button>
          <button class="b3-button" data-action="ai-retry" type="button">重新识别</button>
          <button class="b3-button" data-action="ai-back-edit" type="button">返回编辑</button>
          <button class="b3-button b3-button--cancel" data-action="ai-close" type="button">取消</button>
        </div>
      `;
    }
    renderAiDialogContent() {
      return `
        <div class="stbc-ai-modal">
          <div class="stbc-ai-header">
            <p>输入一句话或粘贴一段文本，我会帮你识别为时间块、全天事件、倒数日、正向日或纪念日。识别结果需要你确认后才会创建。</p>
          </div>
          <textarea class="b3-text-field stbc-ai-textarea" placeholder="- 明天上午 9 点到 11 点背单词
- 6.8-6.30 每天各创建一个❌的全天事件
- 6 月 13 日六级考试，创建倒数日
- 从 2 月 28 日开始考研复习，创建正向日
- 粘贴一段考试安排，我会批量识别"></textarea>
          <div class="stbc-ai-actions">
            <button class="b3-button b3-button--text" data-action="ai-parse" type="button">AI 识别</button>
            <button class="b3-button" data-action="ai-clear" type="button">清空</button>
            <button class="b3-button b3-button--cancel" data-action="ai-close" type="button">关闭</button>
          </div>
          <div class="stbc-ai-loading" hidden>AI 正在识别...</div>
          <div class="stbc-ai-preview" hidden></div>
        </div>
      `;
    }
    openAiDialog() {
      this.aiDialogOpen = !0;
      this.rootElement?.querySelector('[data-action="ai-open"]')?.classList.add("is-active");
      const t = new n.Dialog({
          title: "AI 快速创建",
          content: this.renderAiDialogContent(),
          width: "720px",
        }),
        e = t.element;
      e?.classList.add("stbc-ai-dialog");
      e?.addEventListener("click", (t) => t.stopPropagation());
      e?.querySelector(".b3-dialog__close")?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeAiDialog(t);
      }, { capture: true });
      this.bindAiDialog(t);
      e?.querySelector(".stbc-ai-textarea")?.focus();
    }
    closeAiDialog(t) {
      this.aiDialogOpen = !1;
      this.aiPreviewResult = void 0;
      this.rootElement?.querySelector('[data-action="ai-open"]')?.classList.remove("is-active");
      t?.destroy?.();
    }
    bindAiDialog(t) {
      const e = t.element,
        s = e.querySelector(".stbc-ai-textarea"),
        a = e.querySelector(".stbc-ai-preview"),
        i = e.querySelector(".stbc-ai-loading"),
        o = e.querySelector('[data-action="ai-parse"]');
      e.querySelectorAll('[data-action="ai-close"]').forEach((e) => e.addEventListener("click", () => this.closeAiDialog(t)));
      e.querySelector('[data-action="ai-clear"]')?.addEventListener("click", () => {
        ((s.value = ""), (a.hidden = !0), (a.innerHTML = ""), (this.aiPreviewResult = void 0), s.focus());
      });
      const r = async () => {
        const r = String(s.value || "").trim();
        if (!r) return void (0, n.showMessage)("请先输入要识别的文本");
        this.aiLastInputText = r;
        ((o.disabled = !0), (i.hidden = !1), (a.hidden = !0));
        try {
          await this.loadImportantDays();
          const e = await this.callAiParser(r),
            n = this.validateAiActions(e);
          this.aiPreviewResult = n;
          a.innerHTML = this.renderAiPreviewHTML(n);
          a.hidden = !1;
          this.bindAiPreview(t);
        } catch (t) {
          (0, n.showMessage)(this.maskAiError(t instanceof Error ? t.message : String(t)));
        } finally {
          ((o.disabled = !1), (i.hidden = !0));
        }
      };
      o?.addEventListener("click", r);
    }
    bindAiPreview(t) {
      const e = t.element,
        s = e.querySelector(".stbc-ai-textarea"),
        a = e.querySelector(".stbc-ai-preview");
      a.querySelectorAll('[data-action="ai-color-select"]').forEach((t) => {
        t.addEventListener("change", () => {
          const e = this.aiPreviewResult?.actions?.[Number(t.dataset.index || -1)],
            n = String(t.value || "");
          if (e && n) {
            e.color = this.normalizeImportColor(n, e.category || "");
            t.closest(".stbc-ai-preview-card")?.style.setProperty("--stbc-ai-action-color", e.color);
          }
        });
      });
      a.querySelectorAll('[data-action="ai-toggle-action"]').forEach((t) => {
        t.addEventListener("change", () => {
          const e = this.aiPreviewResult?.actions?.[Number(t.dataset.index || -1)];
          e && (e.selected = Boolean(t.checked));
          const n = a.querySelector('[data-action="ai-create-selected"]');
          n && (n.disabled = !(this.aiPreviewResult?.actions || []).some((t) => t.valid && t.selected));
        });
      });
      a.querySelector('[data-action="ai-back-edit"]')?.addEventListener("click", () => {
        (a.hidden = !0, s.focus());
      });
      a.querySelector('[data-action="ai-retry"]')?.addEventListener("click", () => e.querySelector('[data-action="ai-parse"]')?.click());
      a.querySelector('[data-action="ai-create-selected"]')?.addEventListener("click", async (s) => {
        const a = s.currentTarget;
        a.disabled = !0;
        try {
          const s = await this.createSelectedAiActions();
          this.closeAiDialog(t);
          this.renderCurrentViewFromState();
          (0, n.showMessage)(`AI 创建完成：成功 ${s.ok} 项，失败 ${s.fail} 项`);
        } catch (t) {
          (a.disabled = !1, (0, n.showMessage)(`AI 创建失败：${t instanceof Error ? t.message : String(t)}`));
        }
      });
    }
    async createSelectedAiActions() {
      const t = (this.aiPreviewResult?.actions || []).filter((t) => t.valid && t.selected);
      if (!t.length) throw new Error("请至少选择一个可创建项目");
      let e = 0,
        s = 0,
        a = "";
      await this.loadImportantDays();
      for (const i of t) {
        try {
          if ("create_time_block" === i.type) {
            const t = this.aiTimeToMinutes(i.startTime) - 60 * this.config.dayStartHour,
              n = this.aiTimeToMinutes(i.endTime) - 60 * this.config.dayStartHour,
              o = this.normalizeImportColor(i.color || "", i.category),
              r = await this.createEvent(i.date, t, n, i.title, o, i.category, !1, i.note);
            (this.events.push(r), a || (a = i.date));
          } else if ("create_all_day_event" === i.type) {
            const t = this.getAiDateRangeDays(i.date, i.endDate || i.date),
              n = this.normalizeImportColor(i.color || "", i.category),
              o = await this.createEvent(
                i.date,
                60 * -this.config.dayStartHour,
                24 * t * 60 - 60 * this.config.dayStartHour,
                i.title,
                n,
                i.category,
                !0,
                i.note,
              );
            (this.events.push(o), a || (a = i.date));
          } else if ("create_important_day" === i.type) {
            const t = new Date().toISOString(),
              n = this.normalizeImportantDay({
                id: this.generateImportantDayId(),
                title: i.title,
                date: i.date,
                mode: i.mode,
                theme: i.theme || "blue",
                category: i.category || "",
                note: i.note || "",
                pinned: false,
                archived: false,
                notify: false,
                hideYear: false,
                source: "ai",
                createdAt: t,
                updatedAt: t,
              });
            this.importantDaysState.events = [n, ...(this.importantDaysState.events || [])];
            a || (a = i.date);
          }
          e++;
        } catch (t) {
          (s++, console.warn("create selected ai action failed", this.maskAiError(t instanceof Error ? t.message : String(t))));
        }
      }
      await this.saveImportantDays();
      a && (this.currentDate = new Date(`${a}T12:00:00`));
      return { ok: e, fail: s };
    }
    addPomodoroRecord(t = !0) {
      const e = Math.max(0, this.getPomodoroElapsedSeconds());
      if (e <= 60) return null;
      const n = new Date(),
        s = this.pomodoroSessionStartedAt ? new Date(this.pomodoroSessionStartedAt) : new Date(n.getTime() - 1e3 * e),
        i = {
          id: `pomodoro-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          mode: this.pomodoroMode,
          durationSeconds: e,
          targetSeconds: Math.max(1, Number(this.pomodoroMinutes || 25)) * 60,
          startAt: g(s),
          endAt: g(n),
          completed: !!t,
          note: "",
        };
      this.config.pomodoroRecords = [i, ...this.getPomodoroRecords()].slice(0, 20);
      this.savePomodoroRecords();
      return i;
    }
    openPomodoroRecordNoteDialog(t) {
      const e = this.getPomodoroRecords().find((e) => String(e?.id || "") === String(t || ""));
      if (!e) return;
      const s = new n.Dialog({
          title: "记录本次专注",
          content: `\n        <div class="stbc-form stbc-pomodoro-note-form">\n          <div class="stbc-pomodoro-note-summary">${y(this.formatPomodoroTime(Number(e.durationSeconds || 0)))} · ${y(this.formatPomodoroRecordDate(e.startAt))}</div>\n          <label class="stbc-form-row stbc-form-note-row">\n            <span>备注：</span>\n            <textarea class="b3-text-field stbc-pomodoro-note-input" rows="4" placeholder="这段时间里做了什么？">${y(e.note || "")}</textarea>\n          </label>\n          <div class="stbc-form-actions">\n            <button class="b3-button b3-button--cancel stbc-pomodoro-note-cancel" type="button">稍后再写</button>\n            <button class="b3-button b3-button--text stbc-pomodoro-note-submit" type="button">保存备注</button>\n          </div>\n        </div>\n      `,
          width: "430px",
        }),
        a = s.element,
        i = a.querySelector(".stbc-pomodoro-note-input");
      a?.classList.add("stbc-glass-dialog");
      a?.querySelector(".b3-dialog__close")?.addEventListener("click", (t) => { t.preventDefault(); t.stopPropagation(); s.destroy(); }, { capture: true });
      (i?.focus(),
        a.querySelector(".stbc-pomodoro-note-cancel")?.addEventListener("click", () => s.destroy()),
        a.querySelector(".stbc-pomodoro-note-submit")?.addEventListener("click", () => {
          const note = String(i?.value || "").trim();
          this.config.pomodoroRecords = this.getPomodoroRecords().map((e) =>
            String(e?.id || "") === String(t || "") ? { ...e, note } : e,
          );
          (this.savePomodoroRecords(), s.destroy(), this.renderPomodoroPanel());
        }));
    }
    deletePomodoroRecord(t) {
      const e = String(t || "");
      if (!e) return;
      this.config.pomodoroRecords = this.getPomodoroRecords().filter((t) => String(t?.id || "") !== e);
      this.savePomodoroRecords();
      this.renderPomodoroPanel();
    }
    formatPomodoroRecordDate(t) {
      const e = t instanceof Date ? t : new Date(t);
      if (Number.isNaN(e.getTime())) return "未知时间";
      const n = h(new Date()),
        s = h(e),
        a = Math.round((s.getTime() - n.getTime()) / 864e5),
        i = 0 === a ? "今天" : -1 === a ? "昨天" : `${v(e.getMonth() + 1)}-${v(e.getDate())}`;
      return `${i} ${f(e)}`;
    }
    renderPomodoroHistoryHTML() {
      const t = this.getPomodoroRecords().slice(0, 5);
      if (!t.length) return `<div class="stbc-pomodoro-empty">最近还没有番茄钟记录</div>`;
      return `
        <div class="stbc-pomodoro-history-head">最近 5 次记录</div>
        <div class="stbc-pomodoro-history-list">
          ${t.map((t) => {
            const e = new Date(t.startAt),
              n = new Date(t.endAt),
              s = Number(t.durationSeconds || 0),
              a = "stopwatch" === t.mode ? "正计时" : t.completed ? "已完成" : "已记录";
            return `<div class="stbc-pomodoro-record" data-record-id="${y(String(t.id || ""))}">
              <div class="stbc-pomodoro-record-main">
                <span class="stbc-pomodoro-record-time">${y(this.formatPomodoroRecordDate(e))} - ${Number.isNaN(n.getTime()) ? "--:--" : f(n)}</span>
                <span class="stbc-pomodoro-record-meta">${this.formatPomodoroTime(s)} · ${a}</span>
                ${t.note ? `<span class="stbc-pomodoro-record-note">${y(t.note)}</span>` : ""}
              </div>
              <button class="stbc-pomodoro-record-delete" data-pomodoro-delete="${y(String(t.id || ""))}" type="button" title="删除这条记录" aria-label="删除这条记录">×</button>
            </div>`;
          }).join("")}
        </div>
      `;
    }
    stopPomodoroTimer() {
      (this.pomodoroTimer && window.clearInterval(this.pomodoroTimer), (this.pomodoroTimer = void 0));
    }
    updatePomodoroClock() {
      const t = this.rootElement?.querySelector(".stbc-pomodoro-time");
      t && (t.textContent = this.formatPomodoroTime(this.getPomodoroSeconds()));
      if ("countdown" === this.pomodoroMode && this.pomodoroRunning && this.getPomodoroSeconds() <= 0) {
        const t = Math.max(1, Number(this.pomodoroMinutes || 25)) * 60;
        const e = ((this.pomodoroElapsed = t), (this.pomodoroRunning = !1), this.stopPomodoroTimer(), this.addPomodoroRecord(!0));
        ((this.pomodoroSessionStartedAt = 0), this.renderPomodoroPanel(), e && this.openPomodoroRecordNoteDialog(e.id), (0, n.showMessage)(e ? "番茄钟结束，已记录一次专注" : "番茄钟结束，少于 1 分钟未记录"));
      }
    }
    startPomodoroTimer() {
      (this.stopPomodoroTimer(), this.pomodoroSessionStartedAt || (this.pomodoroSessionStartedAt = Date.now() - 1e3 * Math.max(0, Math.round(this.pomodoroElapsed || 0))), (this.pomodoroStartedAt = Date.now()), (this.pomodoroRunning = !0), (this.pomodoroTimer = window.setInterval(() => this.updatePomodoroClock(), 500)), this.renderPomodoroPanel(), this.updatePomodoroClock());
    }
    pausePomodoroTimer() {
      if (!this.pomodoroRunning) return;
      ((this.pomodoroElapsed += Math.floor((Date.now() - this.pomodoroStartedAt) / 1000)), (this.pomodoroRunning = !1), this.stopPomodoroTimer(), this.renderPomodoroPanel());
    }
    resetPomodoroTimer() {
      ((this.pomodoroElapsed = 0), (this.pomodoroRunning = !1), (this.pomodoroSessionStartedAt = 0), this.stopPomodoroTimer(), this.renderPomodoroPanel());
    }
    renderPomodoroPanel() {
      const t = this.rootElement?.querySelector(".stbc-pomodoro-panel");
      if (!t) return;
      if (!1 === this.config.pomodoroVisible) {
        (this.stopPomodoroTimer(), (this.pomodoroRunning = !1), (this.pomodoroElapsed = 0), (this.pomodoroSessionStartedAt = 0), (t.innerHTML = ""), (t.hidden = !0));
        return;
      }
      t.hidden = !1;
      const e = this.getPomodoroSeconds(),
        n = this.pomodoroRunning ? "暂停" : "开始";
      t.innerHTML = `
        <div class="stbc-pomodoro-card">
          <div class="stbc-pomodoro-head">
            <span class="stbc-pomodoro-title"><span aria-hidden="true">🍅</span> 番茄钟</span>
            <select class="stbc-pomodoro-mode" aria-label="计时模式">
              <option value="countdown" ${"countdown" === this.pomodoroMode ? "selected" : ""}>倒计时</option>
              <option value="stopwatch" ${"stopwatch" === this.pomodoroMode ? "selected" : ""}>正计时</option>
            </select>
          </div>
          <div class="stbc-pomodoro-time">${this.formatPomodoroTime(e)}</div>
          <div class="stbc-pomodoro-controls">
            <input class="b3-text-field stbc-pomodoro-minutes" type="number" min="1" max="180" step="1" value="${Math.max(1, Number(this.pomodoroMinutes || 25))}" ${"stopwatch" === this.pomodoroMode ? "disabled" : ""} />
            <button class="stbc-icon-button stbc-pomodoro-toggle ${this.pomodoroRunning ? "is-pause" : "is-play"}" type="button" title="${n}" aria-label="${n}">
              <span class="stbc-pomodoro-toggle-icon" aria-hidden="true"></span>
            </button>
            <button class="stbc-icon-button stbc-pomodoro-reset" type="button" title="重置" aria-label="重置">↺</button>
          </div>
          <div class="stbc-pomodoro-history">${this.renderPomodoroHistoryHTML()}</div>
        </div>
      `;
      t.querySelector(".stbc-pomodoro-mode")?.addEventListener("change", (t) => {
        ((this.pomodoroMode = String(t.currentTarget?.value || "countdown")), this.resetPomodoroTimer());
      });
      t.querySelector(".stbc-pomodoro-minutes")?.addEventListener("change", (t) => {
        ((this.pomodoroMinutes = Math.max(1, Math.min(180, Number(t.currentTarget?.value || 25)))), this.resetPomodoroTimer());
      });
      t.querySelector(".stbc-pomodoro-toggle")?.addEventListener("click", () => {
        this.pomodoroRunning ? this.pausePomodoroTimer() : this.startPomodoroTimer();
      });
      t.querySelector(".stbc-pomodoro-reset")?.addEventListener("click", () => this.resetPomodoroTimer());
      t.querySelectorAll("[data-pomodoro-delete]").forEach((t) => {
        t.addEventListener("click", (t) => {
          t.stopPropagation();
          this.deletePomodoroRecord(t.currentTarget?.dataset?.pomodoroDelete || "");
        });
      });
      this.pomodoroRunning && !this.pomodoroTimer && this.startPomodoroTimer();
    }
    getEventHoverText(t = {}) {
      const e = t.start instanceof Date ? t.start : t.start ? new Date(t.start) : null,
        n = t.end instanceof Date ? t.end : t.end ? new Date(t.end) : null,
        s = [];
      s.push(t.title || "时间块");
      if (e && !Number.isNaN(e.getTime()) && n && !Number.isNaN(n.getTime())) {
        if (t.allDay) {
          const a = this.getAllDayInclusiveEndDate(n),
            i = a && !Number.isNaN(a.getTime()) ? p(a) : p(e);
          s.push(i === p(e) ? `${p(e)} 全天` : `${p(e)} - ${i} 全天`);
        } else s.push(`${p(e)} ${f(e)} - ${p(n)} ${f(n)}`);
      }
      t.label && s.push(`标签：${t.label}`);
      s.push(`状态：${"done" === t.status ? "已完成" : "未完成"}`);
      t.reminderEnabled && t.reminderTime && s.push(`提醒：${this.getReminderText(t)}`);
      String(t.note || "").trim() && s.push(`备注：${String(t.note || "").trim()}`);
      return s.join("\n");
    }

    renderWeekV2() {
      // v0.4.4: real touchpad-style infinite week scrolling.
      // Render a recyclable 7-week window, then silently re-center it near either edge.
      return this.renderDaysV2(m(b(this.currentDate), -21), 49, "stbc-week--buffered", 21);
    }
    renderThreeDayV2() {
      return this.renderDaysV2(h(this.currentDate), 3, "stbc-week--three");
    }
    renderDaysV2(e, r, c, q = 0) {
      const t = this.rootElement?.querySelector(".stbc-calendar-panel") || this.rootElement?.querySelector(".stbc-main");
      if (!t) return;
      const n = Array.from({ length: r }, (t, n) => m(e, n)),
        s = this.config.dayEndHour - this.config.dayStartHour,
        a = 56 * s,
        i = p(new Date()),
        o = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        mainWidth = this.rootElement?.querySelector(".stbc-main")?.clientWidth || 980,
        dayWidth = Math.max(96, Math.floor((mainWidth - 64) / 7)),
        l = 3 === r ? "180px" : q > 0 ? `${dayWidth}px` : "128px",
        minWidth = `${64 + r * Number.parseInt(l, 10)}px`;
      ((t.innerHTML = `
      <div class="stbc-week ${c || ""}" style="--stbc-hours:${s};--stbc-days:${n.length};--stbc-min-day-width:${l};min-width:${minWidth}">
        <div class="stbc-week-header-grid">
          <div class="stbc-timezone">GMT+8</div>
          ${n.map((t) => `
            <div class="stbc-day-head ${p(t) === i ? "is-today" : ""}">
              <span class="stbc-day-name">${o[t.getDay()]}</span>
              <span class="stbc-day-number">${t.getDate()}</span>
            </div>
          `).join("")}
        </div>
        <div class="stbc-week-body">
          <div class="stbc-all-day-label">全天</div>
          ${n.map((t, e) => `<div class="stbc-all-day-cell ${p(t) === i ? "is-today" : ""}" data-date="${p(t)}" data-index="${e}"></div>`).join("")}
          <div class="stbc-time-gutter" style="height:${a}px">
            ${Array.from({ length: s + 1 }, (t, e) => `<div class="stbc-hour-label ${0 === e ? "is-start" : e === s ? "is-end" : ""}" style="top:${56 * e}px">${v(this.config.dayStartHour + e)}:00</div>`).join("")}
          </div>
          ${n
        .map((t) => {
          const e = p(t);
          return `<div class="stbc-day-column ${e === i ? "is-today" : ""}" data-date="${e}"><div class="stbc-day-column-inner" style="height:${a}px"></div></div>`;
        })
        .join("")}
        </div>
      </div>
    `),
        t
          .querySelectorAll(".stbc-day-column")
          .forEach((t) => this.bindColumn(t)),
        this.bindAllDayRow(n),
        this.queueNowLineUpdate(),
        this.placeAllDayEvents(n));
      const d = this.events.filter((t) => !t.allDay),
        u = this.computeEventLayouts(d);
      for (const t of d)
        this.placeWeekEventV2(t, u.get(t.id) || { lane: 0, laneCount: 1 });
      q > 0 && (this.scrollWeekBufferIntoView(q), this.bindWeekBufferScroll(q));
    }

    scrollWeekBufferIntoView(t) {
      const e = this.rootElement?.querySelector(".stbc-main"),
        n = this.rootElement?.querySelector(".stbc-week .stbc-day-head");
      if (!e || !n) return;
      this.weekBufferCentering = true;
      const s = () => {
        const a = n.getBoundingClientRect().width || Number.parseInt(getComputedStyle(n).minWidth || "128", 10) || 128,
          o = p(this.currentDate),
          r = this.rootElement?.querySelector(`.stbc-day-column[data-date="${o}"]`),
          c = this.rootElement?.querySelector(".stbc-time-gutter"),
          l = c?.getBoundingClientRect?.().width || 64;
        let i = Math.max(0, Math.round(a * t));
        if (r) {
          const t = e.getBoundingClientRect(),
            n = r.getBoundingClientRect(),
            s = t.left + l + Math.max(0, e.clientWidth - l) / 2;
          i = Math.max(0, Math.min(e.scrollWidth - e.clientWidth, Math.round(e.scrollLeft + (n.left + n.width / 2 - s))));
        }
        e.scrollLeft = i;
        // Some Electron/WebView builds restore scrollLeft after layout; set it twice after layout settles.
        window.setTimeout(() => {
          Math.abs(e.scrollLeft - i) > 2 && (e.scrollLeft = i);
          this.queueVisibleDateSyncFromScroll();
          window.setTimeout(() => (this.weekBufferCentering = false), 60);
        }, 80);
      };
      if ("function" == typeof window.requestAnimationFrame)
        window.requestAnimationFrame(() => window.requestAnimationFrame(s));
      else window.setTimeout(s, 0);
    }

    bindWeekBufferScroll(t) {
      const e = this.rootElement?.querySelector(".stbc-main");
      if (!e) return;
      if (e.__stbcWeekBufferScrollBound) {
        window.setTimeout(() => this.queueVisibleDateSyncFromScroll(), 120);
        return;
      }
      e.__stbcWeekBufferScrollBound = true;
      const n = () => {
        this.queueVisibleDateSyncFromScroll();
        this.queueWeekBufferRecycle(t);
      };
      e.addEventListener("scroll", n, { passive: true });
      window.setTimeout(() => this.queueVisibleDateSyncFromScroll(), 120);
    }
    queueVisibleDateSyncFromScroll() {
      if (this.visibleDateSyncRaf) return;
      const t = () => {
        ((this.visibleDateSyncRaf = 0), this.syncVisibleDateFromScroll());
      };
      this.visibleDateSyncRaf = "function" == typeof window.requestAnimationFrame ? window.requestAnimationFrame(t) : window.setTimeout(t, 16);
    }
    syncVisibleDateFromScroll() {
      if (!["week", "three"].includes(this.viewMode)) return;
      const r = this.getVisibleDateFromScroll("center");
      if (!r) return;
      const o = p(r);
      if (!o || o === this.visibleDateKey) return;
      ((this.visibleDateKey = o), (this.currentDate = r));
      const c = this.rootElement?.querySelector(".stbc-toolbar-title");
      c && (c.textContent = this.getToolbarTitleV2());
      this.renderMiniMonthV2();
    }

    getVisibleDateFromScroll(t = "center") {
      const e = this.rootElement?.querySelector(".stbc-main"),
        n = Array.from(this.rootElement?.querySelectorAll(".stbc-day-column[data-date]") || []);
      if (!e || 0 === n.length) return null;
      const s = e.getBoundingClientRect(),
        a = this.rootElement?.querySelector(".stbc-time-gutter"),
        i = a?.getBoundingClientRect?.().width || 64,
        o = s.left + i + ("left" === t ? 8 : Math.max(8, (e.clientWidth - i) / 2)),
        r = n.filter((t) => {
          const e = t.getBoundingClientRect();
          return e.right > s.left + i + 4 && e.left < s.right - 4;
        });
      const c = r.length ? r : n;
      let l = null,
        d = Number.POSITIVE_INFINITY;
      for (const e of c) {
        const n = e.getBoundingClientRect(),
          s = "left" === t ? n.left : n.left + n.width / 2,
          a = Math.abs(s - o);
        a < d && ((d = a), (l = e));
      }
      const u = l?.dataset?.date;
      if (!u) return null;
      const h = new Date(`${u}T12:00:00`);
      return Number.isNaN(h.getTime()) ? null : h;
    }

    getVisibleWeekAnchorDate() {
      const t = this.getVisibleDateFromScroll("left") || this.currentDate;
      return b(t);
    }

    queueWeekBufferRecycle(t = 21) {
      if ("week" !== this.viewMode || this.weekBufferCentering || this.weekBufferRecycling) return;
      const e = this.rootElement?.querySelector(".stbc-main"),
        n = this.rootElement?.querySelector(".stbc-week .stbc-day-head");
      if (!e || !n) return;
      const s = e.scrollWidth - e.clientWidth;
      if (s <= 0) return;
      const a = n.getBoundingClientRect().width || Number.parseInt(getComputedStyle(n).minWidth || "128", 10) || 128,
        i = Math.max(a * 5, 360);
      if (e.scrollLeft > i && e.scrollLeft < s - i) return;
      window.clearTimeout(this.weekBufferRecycleTimer);
      this.weekBufferRecycleTimer = window.setTimeout(() => this.recycleWeekBufferAroundVisibleDate(t), 90);
    }

    async recycleWeekBufferAroundVisibleDate(t = 21) {
      if ("week" !== this.viewMode || this.weekBufferRecycling) return;
      const e = this.rootElement?.querySelector(".stbc-main");
      if (!e) return;
      const n = this.getVisibleDateFromScroll("center") || this.getVisibleDateFromScroll("left") || this.currentDate,
        s = e.scrollTop || 0;
      this.weekBufferRecycling = true;
      try {
        this.currentDate = n;
        await this.loadEvents();
        this.renderMainViewV2();
        const e = this.rootElement?.querySelector(".stbc-main");
        e && (e.scrollTop = s);
        const a = this.rootElement?.querySelector(".stbc-toolbar-title");
        a && (a.textContent = this.getToolbarTitleV2());
        this.renderMiniMonthV2();
      } catch (t) {
        console.warn("week buffer recycle failed", t);
      } finally {
        window.setTimeout(() => (this.weekBufferRecycling = false), 160);
      }
    }

    placeWeekEventV2(t, e) {
      const n = p(t.start),
        s = this.rootElement?.querySelector(
          `.stbc-day-column[data-date="${n}"] .stbc-day-column-inner`,
        );
      if (!s) return;
      const a =
          60 * (t.start.getHours() - this.config.dayStartHour) +
          t.start.getMinutes(),
        o =
          60 * (t.end.getHours() - this.config.dayStartHour) +
          t.end.getMinutes(),
        metrics = this.getDayColumnMetrics(s),
        pixelsPerMinute = metrics.pixelsPerMinute,
        r = Math.max(0, a) * pixelsPerMinute,
        c = Math.max(24, (o - a) * pixelsPerMinute),
        d = l(t.color),
        u = document.createElement("div"),
        h = "done" === t.status;
      ((u.className = "stbc-event"),
        c < 72 && u.classList.add("is-compact"),
        c < 38 && u.classList.add("is-tiny"),
        c < 30 && u.classList.add("is-micro"),
        (u.dataset.id = t.id),
        (u.title = this.getEventHoverText(t)),
        t.id === this.selectedEventId && u.classList.add("is-selected"),
        h && u.classList.add("is-done"),
        (u.draggable = !1),
        u.style.setProperty("--stbc-lane", String(e.lane)),
        u.style.setProperty(
          "--stbc-lane-count",
          String(Math.max(1, e.laneCount)),
        ),
        u.style.setProperty("--stbc-event-color", d.value),
        u.style.setProperty("--stbc-event-bg", d.bg),
        u.style.setProperty("--stbc-event-text", d.text),
        (u.style.top = `${r}px`),
        (u.style.height = `${c}px`),
        (u.innerHTML = `
      <div class="stbc-event-resize stbc-event-resize--top" data-edge="start" title="拖动调整开始时间"></div>
      <button class="stbc-event-status ${h ? "is-done" : ""}" data-action="toggle-status" type="button" title="${h ? "标记未完成" : "标记完成"}" aria-label="${h ? "标记未完成" : "标记完成"}">${h ? "✓" : ""}</button>
      <div class="stbc-event-title">${y(t.title)}</div>
      <div class="stbc-event-time">${f(t.start)} - ${f(t.end)}</div>
      <div class="stbc-event-duration">${y(this.formatEventDurationMinutes((t.end.getTime() - t.start.getTime()) / 6e4))}</div>
      ${t.label ? `<div class="stbc-event-label">${y(t.label)}</div>` : ""}
      ${t.reminderEnabled && t.reminderTime && "true" !== t.reminderFired ? `<div class="stbc-event-reminder">⏰ ${y(this.getReminderText(t))}</div>` : ""}
      <div class="stbc-event-resize stbc-event-resize--bottom" data-edge="end" title="拖动调整结束时间"></div>
    `),
        u
          .querySelector('[data-action="toggle-status"]')
          ?.addEventListener("pointerdown", (t) => t.stopPropagation()),
        u
          .querySelector('[data-action="toggle-status"]')
          ?.addEventListener("click", async (e) => {
            (e.preventDefault(),
              e.stopPropagation(),
              await this.updateEventStatus(t.id, h ? "todo" : "done"));
          }),
        u.addEventListener("contextmenu", (e) => this.openEventMenu(e, t)),
        this.bindEventMove(u, t),
        this.bindEventResize(u, t, s, n),
        s.appendChild(u));
    }
    bindAllDayRow(t) {
      const e = Array.from(
        this.rootElement?.querySelectorAll(".stbc-all-day-cell") || [],
      );
      if (0 === e.length) return;
      let n,
        s = 0,
        a = 0,
        i = !1;
      const o = () => {
        (n?.remove(), (n = void 0), (i = !1));
      };
      e.forEach((r) => {
        (r.addEventListener("pointerdown", (t) => {
          t.target.closest(".stbc-all-day-event") ||
            ((s = Number(r.dataset.index || 0)),
            (a = t.clientX),
            (i = !0),
            t.preventDefault());
        }),
          r.addEventListener("pointermove", (t) => {
            if (!i) return;
            const o = document
              .elementFromPoint(t.clientX, t.clientY)
              ?.closest(".stbc-all-day-cell");
            o &&
              ((Math.abs(t.clientX - a) < 10 && o === r) ||
                ((t) => {
                  const a = Math.min(s, t),
                    i = Math.max(s, t);
                  (n ||
                    ((n = document.createElement("div")),
                    (n.className = "stbc-all-day-selection"),
                    e[a].appendChild(n)),
                    n.parentElement !== e[a] && e[a].appendChild(n),
                    (n.style.width = `calc(${i - a + 1} * 100% + ${i - a}px)`));
                })(Number(o.dataset.index || s)));
          }),
          r.addEventListener("pointerup", async (e) => {
            if (!i) return;
            const n = document
              .elementFromPoint(e.clientX, e.clientY)
              ?.closest(".stbc-all-day-cell");
            if (!n) return void o();
            const r = Number(n.dataset.index || s),
              c = Math.abs(e.clientX - a) >= 10 || r !== s;
            if ((o(), !c)) return;
            const l = Math.min(s, r),
              d = Math.max(s, r);
            await this.openCreateAllDayDialog(p(t[l]), p(t[d]));
          }),
          r.addEventListener("pointercancel", o));
      });
    }
    placeAllDayEvents(t) {
      const e = h(t[0]),
        n = m(e, t.length),
        s = this.events.filter((t) => t.allDay && t.end > e && t.start < n),
        a = [],
        i = [];
      for (const n of s) {
        const s = Math.max(
            0,
            Math.floor((h(n.start).getTime() - e.getTime()) / 864e5),
          ),
          o = Math.ceil((h(n.end).getTime() - e.getTime()) / 864e5),
          r = Math.min(t.length, Math.max(s + 1, o));
        a.push({ event: n, startIndex: s, endIndex: r });
      }
      a.sort((t, e) => t.startIndex - e.startIndex || e.endIndex - t.endIndex);
      for (const t of a) {
        let e = 0;
        for (; e < i.length && t.startIndex < i[e]; e += 1);
        ((t.lane = e), (i[e] = t.endIndex));
      }
      const o = Math.max(1, i.length),
        r = Math.max(42, 10 + 30 * o);
      this.rootElement
        ?.querySelectorAll(".stbc-all-day-cell, .stbc-all-day-label")
        .forEach((t) => {
          t.style.minHeight = `${r}px`;
        });
      for (const n of a) {
        const s = this.rootElement?.querySelector(
          `.stbc-all-day-cell[data-index="${n.startIndex}"]`,
        );
        if (!s) continue;
        const a = n.event,
          i = l(a.color),
          o = document.createElement("div"),
          r = "done" === a.status,
          c = Math.max(1, n.endIndex - n.startIndex),
          d = p(a.start),
          u = p(m(h(a.end), -1));
        ((o.className = `stbc-all-day-event ${r ? "is-done" : ""} ${a.id === this.selectedEventId ? "is-selected" : ""}`),
          (o.dataset.id = a.id),
          (o.title = this.getEventHoverText(a)),
          o.style.setProperty("--stbc-event-color", i.value),
          o.style.setProperty("--stbc-event-bg", i.bg),
          o.style.setProperty("--stbc-event-text", i.text),
          o.style.setProperty("--stbc-all-day-lane", String(n.lane || 0)),
          (o.style.width = `calc(${c} * 100% + ${c - 1}px - 12px)`),
          (o.innerHTML = `<div class="stbc-all-day-resize stbc-all-day-resize--start" data-edge="start" title="拖动调整开始日期"></div><button class="stbc-all-day-status ${r ? "is-done" : ""}" data-action="toggle-status" type="button" title="${r ? "标记未完成" : "标记完成"}" aria-label="${r ? "标记未完成" : "标记完成"}">${r ? "✓" : ""}</button><span class="stbc-all-day-title">${y(a.title)}${a.reminderEnabled && a.reminderTime && "true" !== a.reminderFired ? ` · ⏰ ${y(this.getReminderText(a))}` : ""}</span><div class="stbc-all-day-resize stbc-all-day-resize--end" data-edge="end" title="拖动调整结束日期"></div>`),
          o
            .querySelector('[data-action="toggle-status"]')
            ?.addEventListener("pointerdown", (t) => t.stopPropagation()),
          o
            .querySelector('[data-action="toggle-status"]')
            ?.addEventListener("click", async (t) => {
              (t.preventDefault(),
                t.stopPropagation(),
                await this.updateEventStatus(a.id, r ? "todo" : "done"));
            }),
          o.addEventListener("contextmenu", (t) => this.openEventMenu(t, a)),
          this.bindAllDayEventResize(o, a, t, n),
          this.bindAllDayEventMove(o, a, t),
          s.appendChild(o));
      }
    }
    getAllDayCellIndexFromClientX(t, e = 0) {
      const n = Array.from(
        this.rootElement?.querySelectorAll(".stbc-all-day-cell") || [],
      );
      if (!n.length) return e;
      for (const [e, s] of n.entries()) {
        const n = s.getBoundingClientRect();
        if (t >= n.left && t <= n.right) return e;
      }
      const s = n[0].getBoundingClientRect(),
        a = n[n.length - 1].getBoundingClientRect();
      return t < s.left ? 0 : t > a.right ? n.length - 1 : e;
    }
    paintAllDayEventDraft(t, e, n, s) {
      const a = Array.from(
          this.rootElement?.querySelectorAll(".stbc-all-day-cell") || [],
        ),
        i = a[e],
        o = Math.max(1, n - e);
      (i && t.parentElement !== i && i.appendChild(t),
        t.style.setProperty("--stbc-all-day-lane", String(s || 0)),
        (t.style.width = `calc(${o} * 100% + ${o - 1}px - 12px)`));
    }
    bindAllDayEventMove(t, e, days) {
      let s = -1,
        a = 0,
        i = 0,
        o = 0,
        r = !1,
        c = Math.max(
          1,
          Math.round((h(e.end).getTime() - h(e.start).getTime()) / 864e5),
        ),
        l = 0;
      const d = 6;
      t.addEventListener("pointerdown", (u) => {
        if (0 !== u.button || u.target.closest(".stbc-all-day-resize")) return;
        (u.preventDefault(),
          u.stopPropagation(),
          (s = u.pointerId),
          (a = u.clientX),
          (o = u.clientY),
          (r = !1),
          (i = Math.max(
            0,
            Math.floor((h(e.start).getTime() - h(days[0]).getTime()) / 864e5),
          )),
          (l = i));
        t.setPointerCapture?.(s);
        const m = (a) => {
            if (a.pointerId !== s) return;
            (a.preventDefault(), a.stopPropagation());
            if (!r) {
              const n = Math.abs(a.clientX - u.clientX),
                s = Math.abs(a.clientY - o);
              if (n < d && s < d) return;
              ((r = !0), t.classList.add("is-moving"));
            }
            const b = Math.max(0, days.length - Math.min(c, days.length)),
              v = Math.max(
                0,
                Math.min(b, this.getAllDayCellIndexFromClientX(a.clientX, i)),
              );
            ((l = v), this.paintAllDayEventDraft(t, v, v + Math.min(c, days.length), Number(t.style.getPropertyValue("--stbc-all-day-lane")) || 0));
          },
          b = async (a) => {
            if (a.pointerId !== s) return;
            (t.releasePointerCapture?.(s),
              window.removeEventListener("pointermove", m),
              window.removeEventListener("pointerup", b),
              window.removeEventListener("pointercancel", b),
              t.classList.remove("is-moving"));
            if (!r) return void this.selectEvent(e.id);
            try {
              (await this.updateEventAllDayDate(e.id, p(days[l] || days[i]), c), await this.render());
            } catch (t) {
              (console.error("move all-day calendar event failed", t),
                (0, n.showMessage)(`移动全天事件失败：${t instanceof Error ? t.message : String(t)}`),
                await this.render());
            }
          };
        (window.addEventListener("pointermove", m),
          window.addEventListener("pointerup", b),
          window.addEventListener("pointercancel", b));
      });
    }
    bindAllDayEventResize(t, e, days, a) {
      const i = 6;
      t.querySelectorAll(".stbc-all-day-resize").forEach((o) => {
        o.addEventListener("pointerdown", (r) => {
          if (0 !== r.button) return;
          (r.preventDefault(), r.stopPropagation());
          const c = "start" === o.dataset.edge,
            l = r.pointerId;
          let d = a.startIndex,
            u = a.endIndex,
            h = d,
            m = u,
            b = !1;
          o.setPointerCapture?.(l);
          const v = (t) => {
              const e = this.getAllDayCellIndexFromClientX(t, c ? h : m - 1);
              c ? (h = Math.max(0, Math.min(e, m - 1))) : (m = Math.max(h + 1, Math.min(e + 1, days.length)));
            },
            repaint = () => {
              this.paintAllDayEventDraft(t, h, m, a.lane || 0);
            },
            f = (e) => {
              if (e.pointerId !== l) return;
              (e.preventDefault(), e.stopPropagation());
              if (!b && Math.abs(e.clientX - r.clientX) < i) return;
              ((b = !0), t.classList.add("is-resizing"), v(e.clientX), repaint());
            },
            g = async (r) => {
              if (r.pointerId !== l) return;
              (o.releasePointerCapture?.(l),
                window.removeEventListener("pointermove", f),
                window.removeEventListener("pointerup", g),
                window.removeEventListener("pointercancel", g),
                t.classList.remove("is-resizing"));
              if (!b) return;
              try {
                (v(r.clientX),
                  await this.updateEventAllDayDate(e.id, p(days[h]), Math.max(1, m - h)),
                  await this.render());
              } catch (t) {
                (console.error("resize all-day calendar event failed", t),
                  (0, n.showMessage)(`调整全天事件失败：${t instanceof Error ? t.message : String(t)}`),
                  await this.render());
              }
            };
          (window.addEventListener("pointermove", f),
            window.addEventListener("pointerup", g),
            window.addEventListener("pointercancel", g));
        });
      });
    }
    getDayColumnMetrics(target) {
      const column = target?.classList?.contains("stbc-day-column")
          ? target
          : target?.closest?.(".stbc-day-column"),
        inner = target?.classList?.contains("stbc-day-column-inner")
          ? target
          : column?.querySelector(".stbc-day-column-inner"),
        rect = inner?.getBoundingClientRect(),
        totalMinutes = Math.max(1, 60 * (this.config.dayEndHour - this.config.dayStartHour)),
        pixelsPerMinute = rect && rect.height > 0 ? rect.height / totalMinutes : i;
      return { column, inner, rect, totalMinutes, pixelsPerMinute };
    }
    snapTimelineMinute(value) {
      const slot = Math.max(1, Number(this.config.slotMinutes) || 15);
      return Math.round(Number(value || 0) / slot) * slot;
    }
    clampTimelineMinute(value, min = 0, max = 60 * (this.config.dayEndHour - this.config.dayStartHour)) {
      const num = Number(value);
      return Math.max(min, Math.min(Number.isFinite(num) ? num : min, max));
    }
    getEventStartMinute(event) {
      return 60 * (event.start.getHours() - this.config.dayStartHour) + event.start.getMinutes();
    }
    getEventDurationMinutes(event) {
      return Math.max(this.config.slotMinutes, (event.end.getTime() - event.start.getTime()) / 6e4);
    }
    formatEventDurationMinutes(minutes) {
      const total = Math.max(0, Math.round(Number(minutes || 0))),
        hours = Math.floor(total / 60),
        rest = total % 60;
      if (!hours) return `${rest} 分钟`;
      if (!rest) return `${hours} 小时`;
      return `${hours} 小时 ${rest} 分钟`;
    }
    bindCreateDialogDuration(root, startInput, endInput) {
      if (!root || !startInput || !endInput) return;
      const endRow = endInput.closest(".stbc-form-row"),
        durationRow = document.createElement("div"),
        durationValue = document.createElement("strong"),
        updateDuration = () => {
          const start = this.timeInputToMinutes(startInput.value || ""),
            end = this.timeInputToMinutes(endInput.value || "");
          durationValue.textContent =
            !Number.isNaN(start) && !Number.isNaN(end) && end > start
              ? this.formatEventDurationMinutes(end - start)
              : "--";
        };
      durationRow.className = "stbc-form-row stbc-form-duration-row";
      durationRow.innerHTML = "<span>持续时间</span>";
      durationValue.className = "stbc-form-duration-value";
      durationRow.appendChild(durationValue);
      endRow?.insertAdjacentElement("afterend", durationRow);
      updateDuration();
      startInput.addEventListener("input", updateDuration);
      endInput.addEventListener("input", updateDuration);
    }
    getColumnFromPoint(clientX, clientY, fallbackElement) {
      return document.elementFromPoint(clientX, clientY)?.closest(".stbc-day-column") || fallbackElement?.closest?.(".stbc-day-column");
    }
    bindEventResize(eventEl, event, columnInner, dateKey) {
      const minDuration = Math.max(1, Number(this.config.slotMinutes) || 15),
        threshold = 6,
        formatTime = (date) => `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      eventEl.querySelectorAll(".stbc-event-resize").forEach((handle) => {
        handle.addEventListener("pointerdown", (pointerDownEvent) => {
          if (0 !== pointerDownEvent.button) return;
          (pointerDownEvent.preventDefault(), pointerDownEvent.stopPropagation());
          const resizeStartEdge = "start" === handle.dataset.edge,
            pointerId = pointerDownEvent.pointerId;
          let originalStart = this.getEventStartMinute(event),
            originalEnd = originalStart + this.getEventDurationMinutes(event),
            nextStart = originalStart,
            nextEnd = originalEnd,
            startClientY = pointerDownEvent.clientY,
            resizing = !1;
          handle.setPointerCapture?.(pointerId);
          const minuteFromClientY = (clientY) => {
              const metrics = this.getDayColumnMetrics(columnInner),
                rect = metrics.rect;
              if (!rect) return resizeStartEdge ? nextStart : nextEnd;
              const snapped = this.snapTimelineMinute((clientY - rect.top) / metrics.pixelsPerMinute);
              return resizeStartEdge
                ? this.clampTimelineMinute(snapped, 0, nextEnd - minDuration)
                : this.clampTimelineMinute(snapped, nextStart + minDuration, metrics.totalMinutes);
            },
            paint = () => {
              const metrics = this.getDayColumnMetrics(columnInner);
              eventEl.style.top = `${nextStart * metrics.pixelsPerMinute}px`;
              eventEl.style.height = `${Math.max(24, (nextEnd - nextStart) * metrics.pixelsPerMinute)}px`;
              const startDate = this.minutesToDate(dateKey, nextStart),
                endDate = this.minutesToDate(dateKey, nextEnd),
                timeEl = eventEl.querySelector(".stbc-event-time"),
                durationEl = eventEl.querySelector(".stbc-event-duration");
              timeEl && (timeEl.textContent = `${formatTime(startDate)} - ${formatTime(endDate)}`);
              durationEl &&
                (durationEl.textContent = this.formatEventDurationMinutes((endDate.getTime() - startDate.getTime()) / 6e4));
            },
            onPointerMove = (moveEvent) => {
              if (moveEvent.pointerId !== pointerId) return;
              (moveEvent.preventDefault(), moveEvent.stopPropagation());
              if (!resizing && Math.abs(moveEvent.clientY - startClientY) < threshold) return;
              resizing = !0;
              eventEl.classList.add("is-resizing");
              const snappedMinute = minuteFromClientY(moveEvent.clientY);
              resizeStartEdge ? (nextStart = snappedMinute) : (nextEnd = snappedMinute);
              paint();
            },
            onPointerUp = async (upEvent) => {
              if (upEvent.pointerId !== pointerId) return;
              (handle.releasePointerCapture?.(pointerId),
                window.removeEventListener("pointermove", onPointerMove),
                window.removeEventListener("pointerup", onPointerUp),
                window.removeEventListener("pointercancel", onPointerUp),
                eventEl.classList.remove("is-resizing"));
              if (!resizing) return;
              try {
                const snappedMinute = minuteFromClientY(upEvent.clientY);
                resizeStartEdge ? (nextStart = snappedMinute) : (nextEnd = snappedMinute);
                await this.updateEventTime(event.id, dateKey, nextStart, nextEnd);
                this.renderCurrentViewFromState();
              } catch (error) {
                (console.error("resize calendar event failed", error),
                  (0, n.showMessage)(`调整时间块失败：${error instanceof Error ? error.message : String(error)}`),
                  await this.render());
              }
            };
          (window.addEventListener("pointermove", onPointerMove),
            window.addEventListener("pointerup", onPointerUp),
            window.addEventListener("pointercancel", onPointerUp));
        });
      });
    }
    bindEventMove(eventEl, event) {
      let pointerId = -1,
        startClientX = 0,
        startClientY = 0,
        grabOffsetPx = 0,
        moving = !1;
      const durationMinutes = this.getEventDurationMinutes(event),
        threshold = 6,
        startMinuteFromClientY = (column, clientY) => {
          const metrics = this.getDayColumnMetrics(column);
          if (!metrics.rect) return 0;
          const rawMinute = (clientY - metrics.rect.top - grabOffsetPx) / metrics.pixelsPerMinute,
            snapped = this.snapTimelineMinute(rawMinute),
            maxStart = Math.max(0, metrics.totalMinutes - durationMinutes);
          return this.clampTimelineMinute(snapped, 0, maxStart);
        },
        onPointerMove = (moveEvent) => {
          if (moveEvent.pointerId !== pointerId) return;
          (moveEvent.preventDefault(), moveEvent.stopPropagation());
          if (!moving) {
            const dx = Math.abs(moveEvent.clientX - startClientX),
              dy = Math.abs(moveEvent.clientY - startClientY);
            if (dx < threshold && dy < threshold) return;
            ((moving = !0), eventEl.classList.add("is-moving"));
          }
          const column = this.getColumnFromPoint(moveEvent.clientX, moveEvent.clientY, eventEl);
          if (!column) return;
          const metrics = this.getDayColumnMetrics(column),
            nextStart = startMinuteFromClientY(column, moveEvent.clientY);
          (metrics.inner && eventEl.parentElement !== metrics.inner && metrics.inner.appendChild(eventEl),
            (eventEl.style.top = `${nextStart * metrics.pixelsPerMinute}px`));
        },
        onPointerUp = async (upEvent) => {
          if (upEvent.pointerId !== pointerId) return;
          (eventEl.releasePointerCapture?.(pointerId),
            window.removeEventListener("pointermove", onPointerMove),
            window.removeEventListener("pointerup", onPointerUp),
            window.removeEventListener("pointercancel", onPointerUp),
            eventEl.classList.remove("is-moving"));
          if (!moving) return void this.selectEvent(event.id);
          const column = this.getColumnFromPoint(upEvent.clientX, upEvent.clientY, eventEl);
          if (!column) return void (await this.render());
          const nextStart = startMinuteFromClientY(column, upEvent.clientY);
          try {
            await this.updateEventTime(event.id, column.dataset.date || p(event.start), nextStart, nextStart + durationMinutes);
            this.renderCurrentViewFromState();
          } catch (error) {
            (console.error("move calendar event failed", error),
              (0, n.showMessage)(`移动时间块失败：${error instanceof Error ? error.message : String(error)}`),
              await this.render());
          }
        };
      eventEl.addEventListener("pointerdown", (pointerDownEvent) => {
        if (pointerDownEvent.target.closest(".stbc-event-resize")) return;
        if (0 !== pointerDownEvent.button) return;
        (pointerDownEvent.preventDefault(), pointerDownEvent.stopPropagation());
        const rect = eventEl.getBoundingClientRect();
        ((grabOffsetPx = Math.max(0, pointerDownEvent.clientY - rect.top)),
          (pointerId = pointerDownEvent.pointerId),
          (startClientX = pointerDownEvent.clientX),
          (startClientY = pointerDownEvent.clientY),
          (moving = !1),
          eventEl.setPointerCapture?.(pointerId),
          window.addEventListener("pointermove", onPointerMove),
          window.addEventListener("pointerup", onPointerUp),
          window.addEventListener("pointercancel", onPointerUp));
      });
    }
    renderMonthV2() {
      const t = this.rootElement?.querySelector(".stbc-calendar-panel") || this.rootElement?.querySelector(".stbc-main");
      if (!t) return;
      const e = b(
        new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          1,
        ),
      );
      ((t.innerHTML = `<div class="stbc-month">${Array.from(
        { length: 42 },
        (t, n) => {
          const s = m(e, n),
            a = p(s),
            i = this.events.filter((t) => p(t.start) === a);
          return `
        <div class="stbc-month-day ${a === p(new Date()) ? "is-today" : ""} ${s.getMonth() !== this.currentDate.getMonth() ? "is-outside" : ""}" data-date="${a}">
          <div class="stbc-month-num">${s.getDate()}</div>
          ${i
            .map((t) => {
              const e = l(t.color),
                n = "done" === t.status;
              return `<div class="stbc-month-event ${n ? "is-done" : ""} ${t.id === this.selectedEventId ? "is-selected" : ""}" data-id="${t.id}" title="${y(this.getEventHoverText(t))}" style="--stbc-event-color:${e.value};--stbc-event-bg:${e.bg};--stbc-event-text:${e.text};">
              <button class="stbc-month-status ${n ? "is-done" : ""}" data-action="toggle-status" type="button" title="${n ? "标记未完成" : "标记完成"}" aria-label="${n ? "标记未完成" : "标记完成"}">${n ? "✓" : ""}</button>
              <span>${t.allDay ? "全天" : f(t.start)} ${y(t.title)}</span>
              ${t.label ? `<em>${y(t.label)}</em>` : ""}
              ${t.reminderEnabled && t.reminderTime && "true" !== t.reminderFired ? `<em>⏰ ${y(this.getReminderText(t))}</em>` : ""}
            </div>`;
            })
            .join("")}
        </div>
      `;
        },
      ).join("")}</div>`),
        t.querySelectorAll(".stbc-month-event").forEach((t) => {
          (            t.addEventListener("contextmenu", (e) => {
              const n = this.events.find((e) => e.id === t.dataset.id);
              n && this.openEventMenu(e, n);
            }),
            t
              .querySelector('[data-action="toggle-status"]')
              ?.addEventListener("click", async (e) => {
                (e.preventDefault(), e.stopPropagation());
                const n = this.events.find((e) => e.id === t.dataset.id);
                n &&
                  (await this.updateEventStatus(
                    n.id,
                    "done" === n.status ? "todo" : "done",
                  ));
              }));
        }),
        t.querySelectorAll(".stbc-month-day").forEach((t) => {
          t.addEventListener("dblclick", async () => {
            await this.openCreateEventDialogV2(
              t.dataset.date || p(new Date()),
              540 - 60 * this.config.dayStartHour,
              600 - 60 * this.config.dayStartHour,
            );
          });
        }));
    }
    eventOverlapsDate(event, date) {
      if (!event?.allDay) return !1;
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
        end = m(start, 1);
      return event.start < end && event.end > start;
    }
    eventOverlapsRange(event, start, end) {
      return Boolean(event?.allDay && event.start < end && event.end > start);
    }
    getMonthGoalSearchText(event) {
      return `${event.title || ""} ${event.label || ""} ${event.note || ""}`.toLowerCase();
    }
    getFilteredMonthGoalsForDate(date) {
      const query = String(this.monthGoalQuery || "").trim().toLowerCase(),
        status = this.monthGoalStatus || "all";
      return (this.events || [])
        .filter((event) => this.eventOverlapsDate(event, date))
        .filter((event) => "done" === status ? "done" === event.status : "todo" === status ? "done" !== event.status : !0)
        .filter((event) => !query || this.getMonthGoalSearchText(event).includes(query))
        .sort((a, b) => a.start.getTime() - b.start.getTime() || String(a.title || "").localeCompare(String(b.title || "")));
    }
    renderMonthGoalsV2() {
      const target = this.rootElement?.querySelector(".stbc-calendar-panel") || this.rootElement?.querySelector(".stbc-main");
      if (!target) return;
      const monthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1, 0, 0, 0, 0),
        monthEnd = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1, 0, 0, 0, 0),
        gridStart = b(monthStart),
        today = p(new Date()),
        selected = p(this.currentDate),
        query = String(this.monthGoalQuery || ""),
        status = this.monthGoalStatus || "all",
        monthGoals = (this.events || []).filter((event) => this.eventOverlapsRange(event, monthStart, monthEnd)),
        visibleMonthGoals = monthGoals
          .filter((event) => "done" === status ? "done" === event.status : "todo" === status ? "done" !== event.status : !0)
          .filter((event) => !query.trim() || this.getMonthGoalSearchText(event).includes(query.trim().toLowerCase())),
        doneCount = monthGoals.filter((event) => "done" === event.status).length,
        weekdayLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      target.innerHTML = `
        <section class="stbc-goals-view">
          <div class="stbc-goals-head">
            <label class="stbc-goals-search">
              <span>🔍</span>
              <input class="b3-text-field stbc-goals-search-input" type="search" value="${y(query)}" placeholder="搜索标题/备注/标签" />
            </label>
            <div class="stbc-goals-filters" role="group" aria-label="目标状态筛选">
              <button class="${status === "all" ? "is-active" : ""}" data-goal-status="all" type="button">全部</button>
              <button class="${status === "todo" ? "is-active" : ""}" data-goal-status="todo" type="button">未完成</button>
              <button class="${status === "done" ? "is-active" : ""}" data-goal-status="done" type="button">已完成</button>
            </div>
            <div class="stbc-goals-progress">本月目标：${doneCount}/${monthGoals.length} 已完成${visibleMonthGoals.length !== monthGoals.length ? ` · 当前显示 ${visibleMonthGoals.length}` : ""}</div>
          </div>
          <div class="stbc-goals-weekdays">
            ${weekdayLabels.map((label) => `<span>${label}</span>`).join("")}
          </div>
          <div class="stbc-goals-grid">
            ${Array.from({ length: 42 }, (_, index) => {
              const date = m(gridStart, index),
                dateKey = p(date),
                goals = this.getFilteredMonthGoalsForDate(date),
                outside = date.getMonth() !== this.currentDate.getMonth();
              return `
                <div class="stbc-goal-day ${outside ? "is-outside" : ""} ${dateKey === today ? "is-today" : ""} ${dateKey === selected ? "is-selected" : ""}" data-date="${dateKey}">
                  <div class="stbc-goal-day-head">
                    <span>${date.getDate()}</span>
                    <button class="stbc-goal-add" data-action="new-goal" data-date="${dateKey}" type="button" title="新建本月目标" aria-label="新建本月目标">+</button>
                  </div>
                  <div class="stbc-goal-list">
                    ${goals
                      .map((event) => {
                        const color = l(event.color),
                          done = "done" === event.status;
                        return `
                          <div class="stbc-goal-card ${done ? "is-done" : ""} ${event.id === this.selectedEventId ? "is-selected" : ""}" data-id="${y(event.id)}" tabindex="0" title="${y(this.getEventHoverText(event))}" style="--stbc-event-color:${color.value};--stbc-event-bg:${color.bg};--stbc-event-text:${color.text};">
                            <button class="stbc-goal-status ${done ? "is-done" : ""}" data-action="toggle-status" type="button" title="${done ? "标记未完成" : "标记完成"}" aria-label="${done ? "标记未完成" : "标记完成"}">${done ? "✓" : ""}</button>
                            <span class="stbc-goal-title">${y(event.title)}</span>
                          </div>
                        `;
                      })
                      .join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </section>
      `;
      const searchInput = target.querySelector(".stbc-goals-search-input");
      searchInput?.addEventListener("input", (event) => {
        const input = event.currentTarget;
        this.monthGoalQuery = input.value || "";
        this.renderMonthGoalsV2();
        const nextInput = this.rootElement?.querySelector(".stbc-goals-search-input"),
          position = this.monthGoalQuery.length;
        nextInput?.focus();
        nextInput?.setSelectionRange?.(position, position);
      });
      target.querySelectorAll("[data-goal-status]").forEach((button) => {
        button.addEventListener("click", () => {
          this.monthGoalStatus = button.dataset.goalStatus || "all";
          this.renderMonthGoalsV2();
        });
      });
      target.querySelectorAll(".stbc-goal-card").forEach((card) => {
        card.addEventListener("click", () => this.selectEvent(card.dataset.id));
        card.addEventListener("keydown", (event) => {
          if ("Enter" !== event.key && " " !== event.key) return;
          event.preventDefault();
          this.selectEvent(card.dataset.id);
        });
        card.addEventListener("contextmenu", (event) => {
          const goal = this.events.find((item) => item.id === card.dataset.id);
          goal && this.openEventMenu(event, goal);
        });
        card
          .querySelector('[data-action="toggle-status"]')
          ?.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const goal = this.events.find((item) => item.id === card.dataset.id);
            goal && (await this.updateEventStatus(goal.id, "done" === goal.status ? "todo" : "done"));
          });
      });
      target.querySelectorAll('[data-action="new-goal"]').forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          const dateKey = button.dataset.date || p(new Date());
          await this.openCreateAllDayDialog(dateKey, dateKey);
        });
      });
      target.querySelectorAll(".stbc-goal-day").forEach((day) => {
        day.addEventListener("dblclick", async (event) => {
          if (event.target?.closest?.(".stbc-goal-card, button, input")) return;
          const dateKey = day.dataset.date || p(new Date());
          await this.openCreateAllDayDialog(dateKey, dateKey);
        });
      });
    }
    renderYearV2() {
      const t = this.rootElement?.querySelector(".stbc-calendar-panel") || this.rootElement?.querySelector(".stbc-main");
      if (!t) return;
      const e = this.currentDate.getFullYear(),
        n = p(new Date()),
        s = p(this.currentDate),
        a = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        i = ["一", "二", "三", "四", "五", "六", "日"],
        o = new Map();
      for (const t of this.events || []) {
        const e = p(t.start);
        o.has(e) || o.set(e, []);
        o.get(e).push(t);
      }
      t.innerHTML = `
        <div class="stbc-year">
          ${Array.from({ length: 12 }, (t, r) => {
            const c = this.events
                .filter((t) => t.start.getFullYear() === e && t.start.getMonth() === r)
                .sort((t, e) => t.start.getTime() - e.start.getTime()),
              d = c.length,
              u = c.slice(0, 3);
            return `
              <section class="stbc-year-month" data-month="${r}">
                <button class="stbc-year-month-head" data-action="open-month" data-month="${r}" type="button" title="打开${e}年${r + 1}月">
                  <span>${a[r]}</span>
                  <em>${d ? `${d} 个事件` : "无事件"}</em>
                </button>
                <div class="stbc-year-weekdays">
                  ${i.map((t) => `<span>${t}</span>`).join("")}
                </div>
                <div class="stbc-year-grid"></div>
              </section>
            `;
          }).join("")}
        </div>
      `;
      t.querySelectorAll(".stbc-year-grid").forEach((t) => {
        const a = Number(t.closest(".stbc-year-month")?.dataset.month || "0"),
          i = b(new Date(e, a, 1));
        t.innerHTML = Array.from({ length: 42 }, (t, r) => {
          const c = m(i, r),
            d = p(c),
            u = o.get(d) || [],
            h = u.length;
          const f = h ? `${d}：${h} 个事件${u.slice(0, 5).map((t) => `\n- ${t.title}`).join("")}${h > 5 ? "\n…" : ""}` : d;
          return `<button class="${[
            "stbc-year-day",
            c.getMonth() !== a ? "is-outside" : "",
            d === n ? "is-today" : "",
            d === s ? "is-selected" : "",
            h ? "has-event" : "",
          ].filter(Boolean).join(" ")}" data-date="${d}" type="button" title="${y(f)}">
            <span>${c.getDate()}</span>
            ${h ? `<em>${h}</em>` : ""}
          </button>`;
        }).join("");
      });
      t.querySelectorAll('[data-action="open-month"]').forEach((t) => {
        t.addEventListener("click", (t) => {
          const n = Number(t.currentTarget.dataset.month || "0");
          this.currentDate = new Date(e, n, 1, 12, 0, 0);
          this.viewMode = "month";
          this.render();
        });
      });
      t.querySelectorAll(".stbc-year-day").forEach((t) => {
        t.addEventListener("click", () => {
          this.currentDate = new Date(`${t.dataset.date}T12:00:00`);
          this.renderMiniMonthV2();
          this.rootElement
            ?.querySelectorAll(".stbc-year-day.is-selected")
            .forEach((t) => t.classList.remove("is-selected"));
          t.classList.add("is-selected");
        });
        t.addEventListener("dblclick", async () => {
          await this.openCreateEventDialogV2(
            t.dataset.date || p(new Date()),
            540 - 60 * this.config.dayStartHour,
            600 - 60 * this.config.dayStartHour,
          );
        });
      });
    }
    selectEvent(t) {
      if (!t) return;
      ((this.selectedEventId = t),
        this.rootElement
          ?.querySelectorAll(
            ".stbc-event.is-selected, .stbc-month-event.is-selected, .stbc-year-event.is-selected, .stbc-goal-card.is-selected",
          )
          .forEach((t) => {
            t.classList.remove("is-selected");
          }),
        this.rootElement?.querySelectorAll(`[data-id="${t}"]`).forEach((t) => {
          t.classList.add("is-selected");
        }),
        this.renderInspector(),
        this.animateSelectedEvent(t));
    }
    renderInspector() {
      const t = this.rootElement?.querySelector(".stbc-inspector"),
        e = this.rootElement?.querySelector(".stbc-body");
      if (!t || !e) return;
      if ("important-days" === this.viewMode)
        return (e.classList.remove("has-inspector"), void (t.innerHTML = ""));
      const event = this.events.find((t) => t.id === this.selectedEventId);
      if ((e.classList.toggle("has-inspector", Boolean(event)), !event))
        return void (t.innerHTML = "");
      const colorMeta = l(event.color),
        colorChoices = r
          .map(
            (t) => `
            <label class="stbc-color-choice stbc-inspector-color-choice" title="${t.name}">
              <input type="radio" name="stbc-inspector-color" value="${t.value}" ${t.value === colorMeta.value ? "checked" : ""} />
              <span style="--stbc-choice-color:${t.value};--stbc-choice-bg:${t.bg};"></span>
            </label>`,
          )
          .join(""),
        isAllDayEvent = Boolean(event.allDay),
        allDayEndDate = (() => {
          const t = new Date(event.end);
          if (t > event.start && "00:00" === f(t)) t.setDate(t.getDate() - 1);
          return t < event.start ? p(event.start) : p(t);
        })(),
        timeEditorHTML = isAllDayEvent
          ? `
        <div class="stbc-inspector-edit-grid stbc-inspector-edit-grid--all-day">
          <label class="stbc-inspector-field">
            <span>日期</span>
            <input class="b3-text-field stbc-inspector-all-day-start-date" type="date" value="${p(event.start)}" />
          </label>
          <label class="stbc-inspector-field">
            <span>结束日期</span>
            <input class="b3-text-field stbc-inspector-all-day-end-date" type="date" value="${allDayEndDate}" />
          </label>
        </div>
        <div class="stbc-inspector-row stbc-inspector-all-day-row">
          <span>类型</span>
          <strong>全天事件</strong>
        </div>`
          : `
        <div class="stbc-inspector-edit-grid">
          <label class="stbc-inspector-field">
            <span>开始日期</span>
            <input class="b3-text-field stbc-inspector-start-date" type="date" value="${p(event.start)}" />
          </label>
          <label class="stbc-inspector-field">
            <span>开始时间</span>
            <input class="b3-text-field stbc-inspector-start-time" type="time" value="${f(event.start)}" />
          </label>
          <label class="stbc-inspector-field">
            <span>结束日期</span>
            <input class="b3-text-field stbc-inspector-end-date" type="date" value="${p(event.end)}" />
          </label>
          <label class="stbc-inspector-field">
            <span>结束时间</span>
            <input class="b3-text-field stbc-inspector-end-time" type="time" value="${f(event.end)}" />
          </label>
        </div>`;
      ((t.innerHTML = `
      <div class="stbc-inspector-card stbc-inspector-card--edit">
        <div class="stbc-inspector-head">
          <div>
            <div class="stbc-inspector-kicker">${isAllDayEvent ? "全天事件" : "事件块"}</div>
            <input class="b3-text-field stbc-inspector-title-input" value="${y(event.title)}" aria-label="事件标题" />
          </div>
          <button class="stbc-inspector-close" data-action="inspector-close" type="button" aria-label="关闭">×</button>
        </div>
        ${timeEditorHTML}
        ${this.renderLabelPickerHTML(event.label || "")}
        <div class="stbc-inspector-row stbc-inspector-color-row">
          <span>颜色</span>
          <div class="stbc-color-grid stbc-inspector-color-grid">${colorChoices}</div>
        </div>
        <div class="stbc-inspector-row">
          <span>状态</span>
          <div class="stbc-status-toggle stbc-inspector-status-toggle" data-value="${"done" === event.status ? "done" : "todo"}">
            <button class="${"done" !== event.status ? "is-active" : ""}" data-status="todo" type="button">未完成</button>
            <button class="${"done" === event.status ? "is-active" : ""}" data-status="done" type="button">已完成</button>
          </div>
        </div>
        <div class="stbc-inspector-row stbc-inspector-reminder-row">
          <span>提醒</span>
          <button class="stbc-reminder-edit-button" data-action="inspector-reminder" type="button">${y(this.getReminderText(event))}</button>
        </div>
        <label class="stbc-inspector-row stbc-inspector-note-row">
          <span>备注：</span>
          <textarea class="b3-text-field stbc-inspector-note-input" rows="3" placeholder="写点备注，鼠标悬停时间块时会显示">${y(event.note || "")}</textarea>
        </label>
        <div class="stbc-inspector-actions">
          <button class="b3-button b3-button--cancel" data-action="inspector-reset" type="button">重置</button>
          <button class="b3-button b3-button--text" data-action="inspector-save" type="button">保存修改</button>
        </div>
      </div>
    `),
        this.bindLabelPicker(t),
        this.animateInspectorEntrance(t.querySelector(".stbc-inspector-card")),
        (!isAllDayEvent && (() => {
          const editGrid = t.querySelector(".stbc-inspector-edit-grid"),
            durationRow = document.createElement("div"),
            durationValue = document.createElement("strong"),
            durationInputs = t.querySelectorAll(
              ".stbc-inspector-start-date, .stbc-inspector-start-time, .stbc-inspector-end-date, .stbc-inspector-end-time",
            ),
            updateDuration = () => {
              const startDate = String(t.querySelector(".stbc-inspector-start-date")?.value || p(event.start)),
                startTime = String(t.querySelector(".stbc-inspector-start-time")?.value || f(event.start)),
                endDate = String(t.querySelector(".stbc-inspector-end-date")?.value || p(event.end)),
                endTime = String(t.querySelector(".stbc-inspector-end-time")?.value || f(event.end)),
                start = this.dateTimeInputToDate(startDate, startTime),
                end = this.dateTimeInputToDate(endDate, endTime);
              durationValue.textContent =
                start && end && end > start
                  ? this.formatEventDurationMinutes((end.getTime() - start.getTime()) / 6e4)
                  : "--";
            };
          if (editGrid) {
            durationRow.className = "stbc-inspector-row stbc-inspector-duration-row";
            durationRow.innerHTML = "<span>持续时间</span>";
            durationValue.className = "stbc-inspector-duration-value";
            durationRow.appendChild(durationValue);
            editGrid.insertAdjacentElement("afterend", durationRow);
            updateDuration();
            durationInputs.forEach((input) => input.addEventListener("input", updateDuration));
          }
        })()),
        t
          .querySelector('[data-action="inspector-close"]')
          ?.addEventListener("click", () => {
            ((this.selectedEventId = void 0),
              this.rootElement
                ?.querySelectorAll(
                  ".stbc-event.is-selected, .stbc-month-event.is-selected, .stbc-year-event.is-selected, .stbc-goal-card.is-selected",
                )
                .forEach((t) => {
                  t.classList.remove("is-selected");
                }),
              this.renderInspector());
          }),
        t
          .querySelector('[data-action="inspector-reminder"]')
          ?.addEventListener("click", () => {
            this.openReminderDialog(event).catch((t) => {
              (console.error("open calendar reminder dialog failed", t),
                (0, n.showMessage)(
                  `打开提醒设置失败：${t instanceof Error ? t.message : String(t)}`,
                ));
            });
          }),
        t
          .querySelector('[data-action="inspector-reset"]')
          ?.addEventListener("click", () => this.renderInspector()),
        t.querySelectorAll("[data-status]").forEach((e) => {
          e.addEventListener("click", () => {
            const status = "done" === e.dataset.status ? "done" : "todo",
              statusBox = t.querySelector(".stbc-inspector-status-toggle");
            (statusBox && (statusBox.dataset.value = status),
              t.querySelectorAll("[data-status]").forEach((t) =>
                t.classList.toggle("is-active", t === e),
              ));
          });
        }),
        t
          .querySelector('[data-action="inspector-save"]')
          ?.addEventListener("click", async (e) => {
            const button = e.currentTarget;
            button instanceof HTMLButtonElement && (button.disabled = !0);
            try {
              const title = String(
                  t.querySelector(".stbc-inspector-title-input")?.value || "",
                ).trim() || "新时间块",
                color = String(
                  t.querySelector('input[name="stbc-inspector-color"]:checked')?.value || event.color || c.value,
                ),
                note = String(t.querySelector(".stbc-inspector-note-input")?.value || "").trim(),
                label = await this.resolveDialogLabel(t),
                status = "done" === t.querySelector(".stbc-inspector-status-toggle")?.dataset.value ? "done" : "todo";
              let start, end;
              if (isAllDayEvent) {
                const startDate = String(t.querySelector(".stbc-inspector-all-day-start-date")?.value || p(event.start)),
                  endDate = String(t.querySelector(".stbc-inspector-all-day-end-date")?.value || allDayEndDate),
                  startLocal = this.parseImportantDayLocalDate(startDate),
                  endLocal = this.parseImportantDayLocalDate(endDate);
                if (!startLocal || !endLocal) return void (0, n.showMessage)("请填写有效日期");
                if (endLocal < startLocal) return void (0, n.showMessage)("结束日期不能早于开始日期");
                const spanDays = this.getAiDateRangeDays(startDate, endDate);
                start = this.minutesToDate(startDate, 60 * -this.config.dayStartHour);
                end = this.minutesToDate(startDate, 24 * spanDays * 60 - 60 * this.config.dayStartHour);
              } else {
                const startDate = String(t.querySelector(".stbc-inspector-start-date")?.value || p(event.start)),
                  startTime = String(t.querySelector(".stbc-inspector-start-time")?.value || f(event.start)),
                  endDate = String(t.querySelector(".stbc-inspector-end-date")?.value || p(event.end)),
                  endTime = String(t.querySelector(".stbc-inspector-end-time")?.value || f(event.end));
                start = this.dateTimeInputToDate(startDate, startTime);
                end = this.dateTimeInputToDate(endDate, endTime);
                if (!start || !end) return void (0, n.showMessage)("请填写有效的开始和结束时间");
                if (end <= start) return void (0, n.showMessage)("结束时间必须晚于开始时间");
              }
              await this.updateEventFromInspector(event.id, {
                title,
                start,
                end,
                color,
                label,
                note,
                status,
              });
            } catch (e) {
              (console.error("save calendar inspector failed", e),
                (0, n.showMessage)(
                  `保存事件失败：${e instanceof Error ? e.message : String(e)}`,
                ));
            } finally {
              button instanceof HTMLButtonElement && (button.disabled = !1);
            }
          }));
    }
    getTaskStatusFromKramdown(t) {
      return this.getTaskStatusFromMarkdown(t);
    }
    getTaskStatusFromMarkdown(t) {
      const e = String(t || "").match(/(?:^|\n)\s*[-*]\s+\[([ xX])\]\s+/);
      return e ? ("x" === String(e[1] || "").toLowerCase() ? "done" : "todo") : null;
    }
    buildTaskMarkdown(t, e = "todo") {
      const n = this.safeBlockText(t) || "新时间块",
        s = "done" === e ? "x" : " ";
      return `- [${s}] ${n}`;
    }
    async getTaskBlockRow(t) {
      if (this.parseTableRowEventId(t)) return null;
      const e = this.sqlEscape(t),
        n = await u("/api/query/sql", {
          stmt: `SELECT id, markdown, content, type, subtype FROM blocks WHERE id = '${e}' LIMIT 1`,
        }).catch(() => []);
      return Array.isArray(n) && n.length ? n[0] : null;
    }
    getTaskStatusFromBlockRow(t) {
      return this.getTaskStatusFromMarkdown(t?.markdown || t?.content || "");
    }
    getTaskTitleFromBlockRow(t) {
      const e = w(t?.markdown || t?.content || "");
      return e || "";
    }
    async updateTaskBlockAsTask(t, e, s = "todo") {
      await u("/api/block/updateBlock", {
        id: t,
        dataType: "markdown",
        data: this.buildTaskMarkdown(e, s),
      });
    }
    async syncEventAttrStatusFromTask(t, e, n, s = "") {
      const a = this.getTaskStatusFromBlockRow(n) || this.getTaskStatusFromMarkdown(n),
        i = "done" === e ? "done" : "todo";
      if (a && a !== i)
        await u("/api/attr/setBlockAttrs", {
          id: t,
          attrs: { "custom-calendar-status": a },
        }).catch((e) => {
          console.warn("sync calendar attr status from task failed", t, e);
        });
      return a || i;
    }
    async syncVisibleTaskStatuses({ silent: t = !0 } = {}) {
      if (this.statusSyncBusy || !this.rootElement || !Array.isArray(this.events) || !this.events.length) return;
      this.statusSyncBusy = !0;
      try {
        let e = !1;
        const s = [];
        for (const a of this.events) {
          if (this.parseTableRowEventId(a.id)) {
            s.push(a);
            continue;
          }
          const i = await this.getTaskBlockRow(a.id),
            o = this.getTaskStatusFromBlockRow(i),
            r = "done" === a.status ? "done" : "todo";
          o && o !== r
            ? (await this.setEventAttrs(
                a.id,
                a.title,
                a.start,
                a.end,
                a.color,
                a.label,
                o,
                Boolean(a.allDay),
                a.note || "",
              ).catch((t) => {
                console.warn("sync calendar status attr failed", a.id, t);
              }),
              s.push({ ...a, status: o }),
              (e = !0))
            : s.push(a);
        }
        e &&
          ((this.events = s),
          this.renderCurrentViewFromState(),
          t || (0, n.showMessage)("已同步文档待办状态"));
      } finally {
        this.statusSyncBusy = !1;
      }
    }
    startStatusSyncTimer() {
      this.statusSyncTimer ||
        (this.statusSyncTimer = window.setInterval(() => {
          this.syncVisibleTaskStatuses({ silent: !0 }).catch((t) => {
            console.warn("auto sync task status failed", t);
          });
        }, 2500));
    }
    stopStatusSyncTimer() {
      (this.statusSyncTimer && window.clearInterval(this.statusSyncTimer),
        (this.statusSyncTimer = void 0));
    }
    startReminderTimer() {
      this.reminderTimer ||
        (window.setTimeout(() => {
          this.checkDueReminders().catch((t) => {
            console.warn("initial reminder check failed", t);
          });
        }, 3000),
        (this.reminderTimer = window.setInterval(() => {
          this.checkDueReminders().catch((t) => {
            console.warn("calendar reminder check failed", t);
          });
        }, 30000)));
    }
    stopReminderTimer() {
      (this.reminderTimer && window.clearInterval(this.reminderTimer),
        (this.reminderTimer = void 0));
    }
    toDateTimeLocal(t) {
      const e = t instanceof Date ? t : new Date(t);
      return Number.isNaN(e.getTime()) ? "" : `${p(e)}T${f(e)}`;
    }
    parseDateTimeLocal(t) {
      const e = String(t || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(e)) return null;
      const [n, s] = e.split("T"),
        [a, i, o] = n.split("-").map((t) => Number(t)),
        [r, c] = s.split(":").map((t) => Number(t)),
        l = new Date(a, i - 1, o, r, c, 0, 0);
      return Number.isNaN(l.getTime()) ? null : l;
    }
    getReminderTimeForMode(t, e, n) {
      const s = t.start instanceof Date ? t.start : new Date(t.start);
      if ("none" === e) return null;
      if ("custom" === e) return this.parseDateTimeLocal(n);
      const a = Number(e);
      if (Number.isNaN(a)) return null;
      return new Date(s.getTime() + 60000 * a);
    }
    getReminderModeFromAttrs(t, e) {
      if ("true" !== t["custom-calendar-reminder-enabled"]) return "none";
      const n = String(t["custom-calendar-reminder-offset"] || "");
      return ["0", "-5", "-10", "-30"].includes(n) ? n : "custom";
    }
    getReminderText(t) {
      if (!t?.reminderEnabled || !t.reminderTime) return "不提醒";
      const e = String(t.reminderOffset || "");
      if ("0" === e) return "事件开始时";
      if ("-5" === e) return "提前 5 分钟";
      if ("-10" === e) return "提前 10 分钟";
      if ("-30" === e) return "提前 30 分钟";
      const n = new Date(t.reminderTime);
      return Number.isNaN(n.getTime()) ? "自定义提醒" : `${p(n)} ${f(n)}`;
    }
    renderReminderOption(t, e, n, s = "") {
      return `<label class="stbc-reminder-option ${t === e ? "is-selected" : ""}">
          <input type="radio" name="stbc-reminder-mode" value="${y(t)}" ${t === e ? "checked" : ""} />
          <span class="stbc-reminder-option-main">
            <strong>${y(n)}</strong>
            ${s ? `<em>${y(s)}</em>` : ""}
          </span>
        </label>`;
    }
    async openReminderDialog(t) {
      const e = this.parseTableRowEventId(t.id)
          ? {
              "custom-calendar-reminder-enabled": t.reminderEnabled ? "true" : "false",
              "custom-calendar-reminder-time": t.reminderTime || "",
              "custom-calendar-reminder-offset": t.reminderOffset || "",
            }
          : await u("/api/attr/getBlockAttrs", { id: t.id }).catch(() => ({})),
        s = this.getReminderModeFromAttrs(e),
        a = e["custom-calendar-reminder-time"] || t.reminderTime || "",
        i = a ? new Date(a) : new Date(t.start.getTime() - 10 * 60000),
        o = new n.Dialog({
          title: "设置提醒",
          content: `
        <div class="stbc-form stbc-reminder-form">
          <div class="stbc-reminder-summary">
            <div class="stbc-reminder-title">${y(t.title || "时间块")}</div>
            <div class="stbc-reminder-time">${p(t.start)} ${f(t.start)} - ${f(t.end)}${t.label ? `｜${y(t.label)}` : ""}</div>
          </div>
          <div class="stbc-form-row stbc-reminder-row">
            <span>提醒时间</span>
            <div class="stbc-reminder-options">
              ${this.renderReminderOption("none", s, "不提醒", "关闭这个时间块的提醒")}
              ${this.renderReminderOption("0", s, "事件开始时", f(t.start))}
              ${this.renderReminderOption("-5", s, "提前 5 分钟", f(new Date(t.start.getTime() - 5 * 60000)))}
              ${this.renderReminderOption("-10", s, "提前 10 分钟", f(new Date(t.start.getTime() - 10 * 60000)))}
              ${this.renderReminderOption("-30", s, "提前 30 分钟", f(new Date(t.start.getTime() - 30 * 60000)))}
              ${this.renderReminderOption("custom", s, "自定义时间", "指定某个日期和时间")}
            </div>
          </div>
          <label class="stbc-form-row stbc-reminder-custom-row">
            <span>自定义</span>
            <input class="b3-text-field stbc-reminder-custom" type="datetime-local" value="${this.toDateTimeLocal(i)}" />
          </label>
          <div class="stbc-reminder-hint">到点后会在思源内弹出提醒；如果设置里开启了“电脑系统通知”，也会调用系统通知。思源未运行时不会实时提醒，重新打开后会补发最近 36 小时内错过的提醒。</div>
          <div class="stbc-form-actions">
            <button class="b3-button b3-button--cancel stbc-form-cancel" type="button">取消</button>
            <button class="b3-button b3-button--text stbc-form-submit" type="button">保存提醒</button>
          </div>
        </div>
      `,
          width: "460px",
        }),
        r = o.element;
      r?.classList.add("stbc-glass-dialog");
      r?.querySelector(".b3-dialog__close")?.addEventListener("click", (t) => { t.preventDefault(); t.stopPropagation(); o.destroy(); }, { capture: true });
      const c = () => {
        const t = String(r.querySelector('input[name="stbc-reminder-mode"]:checked')?.value || "none");
        r.querySelector(".stbc-reminder-custom-row")?.classList.toggle("is-visible", "custom" === t);
        r.querySelectorAll(".stbc-reminder-option").forEach((e) => {
          e.classList.toggle("is-selected", e.querySelector("input")?.value === t);
        });
      };
      r.querySelectorAll('input[name="stbc-reminder-mode"]').forEach((t) => {
        t.addEventListener("change", c);
      });
      c();
      r.querySelector(".stbc-form-cancel")?.addEventListener("click", () => o.destroy());
      r.querySelector(".stbc-form-submit")?.addEventListener("click", async (e) => {
        const s = e.currentTarget;
        s instanceof HTMLButtonElement && (s.disabled = !0);
        try {
          const e = String(r.querySelector('input[name="stbc-reminder-mode"]:checked')?.value || "none"),
            a = String(r.querySelector(".stbc-reminder-custom")?.value || ""),
            i = this.getReminderTimeForMode(t, e, a);
          if ("none" !== e && (!i || Number.isNaN(i.getTime()))) return void (0, n.showMessage)("请填写有效的提醒时间");
          await this.saveEventReminder(t.id, e, i);
          o.destroy();
        } catch (t) {
          (console.error("save calendar reminder failed", t),
            (0, n.showMessage)(`保存提醒失败：${t instanceof Error ? t.message : String(t)}`));
        } finally {
          s instanceof HTMLButtonElement && (s.disabled = !1);
        }
      });
    }
    async saveEventReminder(t, e, s) {
      const a = this.events.find((e) => e.id === t) || {};
      if ("none" === e) {
        const e = { ...a, reminderEnabled: !1, reminderTime: "", reminderOffset: "", reminderFired: "false", reminderFiredAt: "" };
        await this.rewriteEventRecordBlock(t, e, { writeAttrs: !0 }).catch((t) => {
          console.warn("rewrite calendar table after reminder disabled failed", t);
        });
        await this.clearTableReminderFiredForEvent(t).catch((t) => {
          console.warn("clear table reminder fired state failed", t);
        });
        this.reminderNotifiedInSession.delete(t);
        this.events = this.events.map((e) => e.id === t ? { ...e, reminderEnabled: !1, reminderTime: "", reminderOffset: "", reminderFired: "false", reminderFiredAt: "" } : e);
        this.renderCurrentViewFromState();
        return void (0, n.showMessage)("已关闭提醒");
      }
      const i = "custom" === e ? "custom" : String(e),
        o = g(s),
        r = { ...a, reminderEnabled: !0, reminderTime: o, reminderOffset: i, reminderFired: "false", reminderFiredAt: "" };
      await this.rewriteEventRecordBlock(t, r, { writeAttrs: !0 }).catch((t) => {
        console.warn("rewrite calendar table after reminder update failed", t);
      });
      await this.clearTableReminderFiredForEvent(t).catch((t) => {
        console.warn("clear table reminder fired state failed", t);
      });
      this.reminderNotifiedInSession.delete(t);
      this.events = this.events.map((e) => e.id === t ? { ...e, reminderEnabled: !0, reminderTime: o, reminderOffset: i, reminderFired: "false", reminderFiredAt: "" } : e);
      this.renderCurrentViewFromState();
      (0, n.showMessage)(`已设置提醒：${p(s)} ${f(s)}`);
      window.setTimeout(() => {
        this.checkDueReminders().catch((t) => {
          console.warn("check reminder immediately after save failed", t);
        });
      }, 300);
    }
    async rebaseReminderForEvent(t, e) {
      if (this.parseTableRowEventId(t)) {
        const n = this.events.find((e) => e.id === t);
        if (!n?.reminderEnabled) return;
        const s = String(n.reminderOffset || "");
        if (!["0", "-5", "-10", "-30"].includes(s)) return;
        const a = new Date(e.getTime() + 60000 * Number(s)),
          i = g(a);
        await this.updateEventRowFromEvent(t, { ...n, reminderTime: i, reminderFired: "false", reminderFiredAt: "" });
        this.reminderNotifiedInSession.delete(t);
        this.events = this.events.map((e) => e.id === t ? { ...e, reminderTime: i, reminderFired: "false", reminderFiredAt: "" } : e);
        return;
      }
      const n = await u("/api/attr/getBlockAttrs", { id: t }).catch(() => ({}));
      if ("true" !== n["custom-calendar-reminder-enabled"]) return;
      const s = String(n["custom-calendar-reminder-offset"] || "");
      if (!["0", "-5", "-10", "-30"].includes(s)) return;
      const a = new Date(e.getTime() + 60000 * Number(s)),
        i = g(a);
      await u("/api/attr/setBlockAttrs", {
        id: t,
        attrs: {
          "custom-calendar-reminder-time": i,
          "custom-calendar-reminder-fired": "false",
          "custom-calendar-reminder-fired-at": "",
        },
      });
      this.reminderNotifiedInSession.delete(t);
      this.events = this.events.map((e) => e.id === t ? { ...e, reminderTime: i, reminderFired: "false", reminderFiredAt: "" } : e);
    }
    getTableReminderFiredMap() {
      return (
        this.config.tableReminderFiredMap &&
        "object" == typeof this.config.tableReminderFiredMap &&
        !Array.isArray(this.config.tableReminderFiredMap)
          ? this.config.tableReminderFiredMap
          : ((this.config.tableReminderFiredMap = {}), this.config.tableReminderFiredMap)
      );
    }
    buildTableReminderKey(t) {
      return t?.id && t?.reminderTime ? `${t.id}__${t.reminderTime}` : "";
    }
    applyTableReminderFiredState(t) {
      if (!t || !this.parseTableRowEventId(t.id)) return t;
      const e = this.buildTableReminderKey(t),
        n = e ? this.getTableReminderFiredMap()[e] : "";
      return n ? { ...t, reminderFired: "true", reminderFiredAt: String(n) } : t;
    }
    async clearTableReminderFiredForEvent(t) {
      if (!this.parseTableRowEventId(t)) return;
      const e = this.getTableReminderFiredMap(),
        n = `${t}__`;
      let s = !1;
      for (const a of Object.keys(e))
        a.startsWith(n) && (delete e[a], (s = !0));
      s && (await this.saveData(a, this.config));
    }
    async markTableReminderFired(t, e = new Date()) {
      if (!t || !this.parseTableRowEventId(t.id)) return;
      const n = this.buildTableReminderKey(t);
      if (!n) return;
      this.getTableReminderFiredMap()[n] = g(e);
      await this.saveData(a, this.config);
    }
    collectDueVisibleTableReminders(t, e) {
      return (this.events || [])
        .map((t) => this.applyTableReminderFiredState(t))
        .filter((n) => {
          if (!n || !this.parseTableRowEventId(n.id) || !n.reminderEnabled || !n.reminderTime || "true" === n.reminderFired || this.reminderNotifiedInSession.has(n.id)) return !1;
          const s = new Date(n.reminderTime);
          return !Number.isNaN(s.getTime()) && s >= t && s <= e;
        });
    }
    async collectDueTableReminders(t, e) {
      const n = await u("/api/query/sql", {
        stmt: "SELECT id, markdown, content, type FROM blocks WHERE (markdown LIKE '%开始时间%' OR content LIKE '%开始时间%') AND (markdown LIKE '%提醒%' OR content LIKE '%提醒%') LIMIT 2000",
      }).catch(() => []),
        s = [];
      for (const a of n || []) {
        const n = this.parseEventTableMarkdown(a.markdown || a.content || "");
        if (!n) continue;
        n.rows.forEach((n, i) => {
          const o = this.eventFromTableRow(a.id, i, n);
          if (!o || !o.reminderEnabled || !o.reminderTime || "true" === o.reminderFired || this.reminderNotifiedInSession.has(o.id)) return;
          const r = new Date(o.reminderTime);
          Number.isNaN(r.getTime()) || r < t || r > e || s.push(o);
        });
      }
      return s.sort((t, e) => new Date(t.reminderTime) - new Date(e.reminderTime));
    }
    async fireTableRowReminder(t, e = new Date()) {
      if (!t?.id) return;
      this.reminderNotifiedInSession.add(t.id);
      const s = t.title || "时间块",
        a = t.label ? `｜${t.label}` : "",
        i = t.start instanceof Date ? t.start : new Date(t.start),
        o = t.end instanceof Date ? t.end : new Date(t.end),
        r = i && !Number.isNaN(i.getTime()) ? `${p(i)} ${f(i)}${o && !Number.isNaN(o.getTime()) ? ` - ${f(o)}` : ""}` : "";
      (0, n.showMessage)(`⏰ ${s}\n${r}${a}`, 9000);
      await this.showDesktopSystemNotification(`⏰ ${s}`, `${r}${a}`, {
        eventId: t.id,
        reminderTime: t.reminderTime,
        eventStart: t.start,
        tag: `time-block-calendar-${t.id}`,
      });
      await this.markTableReminderFired(t, e).catch((e) => {
        console.warn("mark table reminder fired failed", t.id, e);
      });
      this.events = this.events.map((e) => e.id === t.id ? { ...e, reminderFired: "true", reminderFiredAt: g(new Date()) } : e);
      this.renderCurrentViewFromState();
    }
    async checkDueReminders() {
      if (this.reminderBusy) return;
      this.reminderBusy = !0;
      try {
        const t = new Date(),
          e = new Date(t.getTime() - 36 * 60 * 60 * 1000),
          s = await u("/api/query/sql", {
            stmt: `SELECT block_id, value FROM attributes WHERE name = 'custom-calendar-reminder-time' AND value >= '${g(e)}' AND value <= '${g(t)}' ORDER BY value ASC LIMIT 50`,
          }).catch(() => []);
        for (const e of s || []) {
          const s = e.block_id;
          if (!s || this.reminderNotifiedInSession.has(s)) continue;
          const a = await u("/api/attr/getBlockAttrs", { id: s }).catch(() => ({}));
          if ("true" !== a["custom-calendar-reminder-enabled"] || "true" === a["custom-calendar-reminder-fired"]) continue;
          const i = new Date(a["custom-calendar-reminder-time"] || e.value);
          if (Number.isNaN(i.getTime()) || i > t) continue;
          await this.fireSiYuanReminder(s, a, t);
        }
        const a = new Map();
        for (const n of this.collectDueVisibleTableReminders(e, t)) a.set(n.id, n);
        for (const n of await this.collectDueTableReminders(e, t).catch((t) => (console.warn("collect table reminders failed", t), [])))
          n?.id && !a.has(n.id) && a.set(n.id, n);
        for (const e of a.values()) {
          if (!e?.id || this.reminderNotifiedInSession.has(e.id)) continue;
          await this.fireTableRowReminder(e, t);
        }
      } finally {
        this.reminderBusy = !1;
      }
    }
    isDesktopNotificationSupported() {
      return "undefined" != typeof window && "Notification" in window;
    }
    async ensureDesktopNotificationPermission(t = !1) {
      if (!this.isDesktopNotificationSupported())
        return (
          t &&
            (0, n.showMessage)(
              "当前环境不支持系统通知，请确认是在思源桌面端使用插件。",
            ),
          !1
        );
      const e = window.Notification;
      if ("granted" === e.permission) return !0;
      if ("denied" === e.permission)
        return (
          t &&
            (0, n.showMessage)(
              "系统通知权限已被拒绝，请到系统通知设置中允许思源发送通知。",
              7000,
            ),
          !1
        );
      if ("function" != typeof e.requestPermission) return !1;
      try {
        const s = await e.requestPermission();
        return "granted" === s
          ? !0
          : (t && (0, n.showMessage)("未获得系统通知权限，暂时只能使用思源内提醒。", 6000), !1);
      } catch (s) {
        return (
          console.warn("request desktop notification permission failed", s),
          t &&
            (0, n.showMessage)(
              `申请系统通知权限失败：${s instanceof Error ? s.message : String(s)}`,
              7000,
            ),
          !1
        );
      }
    }
    async showDesktopSystemNotification(t, e, s = {}) {
      if (!1 === this.config.desktopNotificationEnabled) return !1;
      const a = s?.reminderTime ? new Date(s.reminderTime) : null;
      if (
        !s?.allowMissed &&
        !this.config.desktopNotificationMissedEnabled &&
        a &&
        !Number.isNaN(a.getTime()) &&
        Date.now() - a.getTime() > 10 * 60 * 1000
      )
        return !1;
      if (!(await this.ensureDesktopNotificationPermission(!1))) return !1;
      try {
        const i = new window.Notification(t, {
          body: e,
          tag: s?.tag || `time-block-calendar-${s?.eventId || Date.now()}`,
          renotify: !0,
          silent: !1,
        });
        return (
          (i.onclick = () => {
            try {
              (window.focus?.(), this.openCalendarTab());
              s?.eventId &&
                window.setTimeout(() => {
                  try {
                    const t = s?.eventStart ? new Date(s.eventStart) : null;
                    t && !Number.isNaN(t.getTime()) && (this.currentDate = t);
                    this.render()
                      .then(() => this.selectEvent(s.eventId))
                      .catch((t) => {
                        (console.warn("render reminder event after notification click failed", t),
                          this.selectEvent(s.eventId));
                      });
                  } catch (t) {
                    console.warn("select reminder event after notification click failed", t);
                  }
                }, 600);
            } catch (t) {
              console.warn("desktop notification click handler failed", t);
            }
          }),
          window.setTimeout(() => {
            try {
              i.close();
            } catch (t) {}
          }, 12e3),
          !0
        );
      } catch (a) {
        return (
          console.warn("show desktop notification failed", a),
          !1
        );
      }
    }
    async fireSiYuanReminder(t, e, s = new Date()) {
      this.reminderNotifiedInSession.add(t);
      const a = e["custom-calendar-title"] || "时间块",
        i = e["custom-calendar-label"] ? `｜${e["custom-calendar-label"]}` : "",
        o = e["custom-calendar-start"] ? new Date(e["custom-calendar-start"]) : null,
        r = e["custom-calendar-end"] ? new Date(e["custom-calendar-end"]) : null,
        c = o && !Number.isNaN(o.getTime()) ? `${p(o)} ${f(o)}${r && !Number.isNaN(r.getTime()) ? ` - ${f(r)}` : ""}` : "";
      (0, n.showMessage)(`⏰ ${a}\n${c}${i}`, 9000);
      await this.showDesktopSystemNotification(`⏰ ${a}`, `${c}${i}`, {
        eventId: t,
        reminderTime: e["custom-calendar-reminder-time"],
        eventStart: e["custom-calendar-start"],
        tag: `time-block-calendar-${t}`,
      });
      await u("/api/attr/setBlockAttrs", {
        id: t,
        attrs: {
          "custom-calendar-reminder-fired": "true",
          "custom-calendar-reminder-fired-at": g(s),
        },
      }).catch((e) => {
        console.warn("mark reminder fired failed", t, e);
      });
      this.events = this.events.map((e) => e.id === t ? { ...e, reminderFired: "true", reminderFiredAt: g(s) } : e);
      this.renderCurrentViewFromState();
    }
    async updateEventStatus(t, e) {
      const s = this.events.find((e) => e.id === t);
      if (s) {
        await this.rewriteEventRecordBlock(t, { ...s, status: e }, { writeAttrs: !0 }).catch((t) => {
          console.warn("rewrite calendar table after status change failed", t);
        });
      } else {
        await u("/api/attr/setBlockAttrs", {
          id: t,
          attrs: { "custom-calendar-status": e },
        });
      }
      this.events = this.events.map((n) =>
        n.id === t ? { ...n, status: e } : n,
      );
      this.renderCurrentViewFromState();
      (0, n.showMessage)("done" === e ? "已标记完成" : "已标记未完成");
    }
    dateTimeInputToDate(t, e) {
      if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(t) || !e || !/^\d{2}:\d{2}$/.test(e))
        return null;
      const [n, s, a] = t.split("-").map((t) => Number(t)),
        [i, o] = e.split(":").map((t) => Number(t)),
        r = new Date(n, s - 1, a, i, o, 0, 0);
      return Number.isNaN(r.getTime()) ? null : r;
    }
    async updateTaskTitle(t, e) {
      const n = this.safeBlockText(e) || "新时间块";
      await this.rewriteEventRecordBlock(t, { title: n }, { writeAttrs: !0 });
    }
    async updateEventFromInspector(t, e) {
      const s = this.events.find((e) => e.id === t),
        a = this.safeBlockText(e.title) || "新时间块",
        i = e.start instanceof Date ? e.start : new Date(e.start),
        o = e.end instanceof Date ? e.end : new Date(e.end),
        r = e.color || s?.color || c.value,
        l = String(e.label || "").trim(),
        note = String(e.note || "").trim(),
        d = "done" === e.status ? "done" : "todo",
        h = Boolean(s?.allDay);
      if (Number.isNaN(i.getTime()) || Number.isNaN(o.getTime()))
        throw new Error("时间格式不正确");
      if (o <= i) throw new Error("结束时间必须晚于开始时间");
      l &&
        (await this.addLabelOption(l).catch((t) => {
          console.warn("save calendar label option failed", t);
        }));
      await this.rewriteEventRecordBlock(
        t,
        { ...(s || {}), title: a, start: i, end: o, color: r, label: l, note, status: d, allDay: h },
        { writeAttrs: !0 },
      ).catch((t) => {
        console.warn("rewrite calendar table from inspector failed", t);
      });
      await this.rebaseReminderForEvent(t, i).catch((e) => {
        console.warn("rebase reminder after inspector update failed", t, e);
      });
      this.events = this.events.map((e) =>
        e.id === t
          ? { ...e, title: a, start: i, end: o, color: r, label: l, note, status: d }
          : e,
      );
      this.renderCurrentViewFromState();
      (0, n.showMessage)("事件块已更新");
    }
    async syncTaskCheckbox(t, e) {
      const s = this.events.find((e) => e.id === t),
        a = "done" === e ? "done" : "todo";
      await this.rewriteEventRecordBlock(t, { ...(s || {}), status: a }, { writeAttrs: !0 });
    }
    openEventMenu(t, e) {
      (t.preventDefault(), t.stopPropagation());
      const s = new n.Menu("time-block-calendar-event-menu"),
        a = "done" === e.status;
      (s.addItem({
        icon: "iconEdit",
        label: "属性",
        click: () => {
          this.selectEvent(e.id);
        },
      }),
        s.addItem({
        icon: "iconClock",
        label: e.reminderEnabled ? "修改提醒" : "设置提醒",
        click: () => {
          this.openReminderDialog(e).catch((t) => {
            (console.error("open calendar reminder dialog failed", t),
              (0, n.showMessage)(
                `打开提醒设置失败：${t instanceof Error ? t.message : String(t)}`,
              ));
          });
        },
      }),
        s.addItem({
        icon: "iconSelect",
        label: a ? "标记未完成" : "标记完成",
        click: () => {
          this.updateEventStatus(e.id, a ? "todo" : "done").catch((t) => {
            (console.error("update calendar event status failed", t),
              (0, n.showMessage)(
                `更新时间块状态失败：${t instanceof Error ? t.message : String(t)}`,
              ));
          });
        },
      }),
        s.addItem({
          icon: "iconCopy",
          label: "复制时间块",
          click: () => {
            this.duplicateEvent(e).catch((t) => {
              (console.error("duplicate calendar event failed", t),
                (0, n.showMessage)(
                  `复制时间块失败：${t instanceof Error ? t.message : String(t)}`,
                ));
            });
          },
        }),
        s.addItem({
          icon: "iconTrashcan",
          label: "删除时间块",
          click: () => {
            this.deleteEvent(e).catch((t) => {
              (console.error("delete calendar event failed", t),
                (0, n.showMessage)(
                  `删除时间块失败：${t instanceof Error ? t.message : String(t)}`,
                ));
            });
          },
        }),
        s.open({ x: t.clientX, y: t.clientY }));
    }
    async duplicateEvent(t) {
      const e =
          60 * (t.start.getHours() - this.config.dayStartHour) +
          t.start.getMinutes(),
        s =
          60 * (t.end.getHours() - this.config.dayStartHour) +
          t.end.getMinutes();
      (await this.createEvent(
        p(t.start),
        e,
        s,
        t.title,
        t.color || c.value,
        t.label || "",
      ),
        await this.render(),
        (0, n.showMessage)("已复制时间块"));
    }
    renderCurrentViewFromState() {
      (this.renderMainViewV2(),
        this.renderMiniMonthV2(),
        this.renderInspector(),
        this.updateNowLine());
    }
    scheduleRefreshAfterDelete(t) {
      return;
    }
    async deleteEvent(t) {
      if (!window.confirm(`删除时间块“${t.title}”？\n\n这会删除对应表格里的这一行记录。`)) return;
      if (this.parseTableRowEventId(t.id)) {
        await this.deleteEventRow(t.id);
      } else {
        await u("/api/block/deleteBlock", { id: t.id });
      }
      this.recentlyDeletedEventIds.set(t.id, Date.now());
      this.events = this.events.filter((e) => e.id !== t.id);
      this.selectedEventId === t.id && (this.selectedEventId = void 0);
      this.rootElement
        ?.querySelectorAll(`[data-id="${t.id}"]`)
        .forEach((t) => t.remove());
      this.renderCurrentViewFromState();
      (0, n.showMessage)("已删除时间块");
    }
    getLabelOptions() {
      const t = Array.isArray(this.config.labelOptions)
          ? this.config.labelOptions
          : [],
        e = this.events?.map((t) => t.label).filter(Boolean) || [],
        n = new Set(
          Array.isArray(this.config.deletedLabelOptions)
            ? this.config.deletedLabelOptions.map((t) => String(t || "").trim())
            : [],
        );
      return Array.from(
        new Set(
          [...t, ...e].map((t) => String(t || "").trim()).filter(Boolean),
        ),
      ).filter((t) => !n.has(t));
    }
    renderLabelPickerHTML(t = "") {
      const e = this.getLabelOptions(),
        n = String(t || "").trim(),
        s = n ? n : "无标签 / 不分类",
        a = e
          .map(
            (t) => `<div class="stbc-label-option-row ${t === n ? "is-selected" : ""}" data-label-row="${y(t)}">
                <button type="button" class="stbc-label-option" data-label="${y(t)}">
                  <span>${y(t)}</span>
                </button>
                <button type="button" class="stbc-label-delete" data-label="${y(t)}" title="删除标签“${y(t)}”" aria-label="删除标签“${y(t)}”"><svg class="stbc-label-delete-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Z"></path><path d="M7 9h10l-.8 11.2A2 2 0 0 1 14.2 22H9.8a2 2 0 0 1-2-1.8L7 9Z"></path><path d="M10 11v7M14 11v7"></path></svg></button>
              </div>`,
          )
          .join("");
      return `<div class="stbc-form-row stbc-label-row">
            <span>标签</span>
            <div class="stbc-label-picker" data-value="${y(n)}">
              <button type="button" class="b3-text-field stbc-label-trigger" aria-haspopup="listbox" aria-expanded="false">
                <span class="stbc-label-trigger-text">${y(s)}</span>
                <span class="stbc-label-trigger-arrow">⌄</span>
              </button>
              <div class="stbc-label-menu" role="listbox">
                <button type="button" class="stbc-label-option stbc-label-option--empty ${n ? "" : "is-selected"}" data-label="">
                  <span>无标签 / 不分类</span>
                </button>
                ${a}
                <button type="button" class="stbc-label-option stbc-label-new-option" data-label="__new__">
                  <span>+ 新建选项...</span>
                </button>
              </div>
              <input class="b3-text-field stbc-form-label-new" placeholder="输入新标签，例如 考研英语" />
            </div>
          </div>`;
    }
    bindLabelPicker(t) {
      const e = t.querySelector(".stbc-label-picker"),
        n = t.querySelector(".stbc-label-trigger"),
        s = t.querySelector(".stbc-label-trigger-text"),
        a = t.querySelector(".stbc-label-menu"),
        i = t.querySelector(".stbc-form-label-new");
      if (!e || !n || !s || !a || !i) return;
      const o = () => {
          a.classList.remove("is-open");
          n.setAttribute("aria-expanded", "false");
        },
        r = () => {
          a.classList.add("is-open");
          n.setAttribute("aria-expanded", "true");
        },
        c = (t) => {
          ((e.dataset.value = t),
            (s.textContent = "__new__" === t ? "+ 新建选项..." : t || "无标签 / 不分类"),
            (i.style.display = "__new__" === t ? "block" : "none"),
            a.querySelectorAll(".is-selected").forEach((t) =>
              t.classList.remove("is-selected"),
            ));
          const n = t
            ? a.querySelector(`[data-label="${CSS.escape(t)}"]`)
            : a.querySelector('[data-label=""]');
          n?.classList.add("is-selected");
          n?.closest(".stbc-label-option-row")?.classList.add("is-selected");
          "__new__" === t && window.setTimeout(() => i.focus(), 0);
        };
      (n.addEventListener("click", (t) => {
        t.preventDefault();
        t.stopPropagation();
        a.classList.contains("is-open") ? o() : r();
      }),
        a.addEventListener("click", async (t) => {
          const n = t.target;
          if (!(n instanceof HTMLElement)) return;
          const s = n.closest(".stbc-label-delete");
          if (s) {
            t.preventDefault();
            t.stopPropagation();
            const n = String(s.dataset.label || "").trim();
            if (!n) return;
            const a = e.dataset.value === n,
              i = e.closest(".stbc-form") || document;
            await this.deleteLabelOption(n);
            const o = e.closest(".stbc-label-row");
            if (o) {
              o.outerHTML = this.renderLabelPickerHTML(a ? "" : e.dataset.value || "");
              this.bindLabelPicker(i);
            }
            return;
          }
          const l = n.closest(".stbc-label-option");
          if (!l) return;
          t.preventDefault();
          t.stopPropagation();
          c(String(l.dataset.label || ""));
          o();
        }),
        document.addEventListener(
          "click",
          (t) => {
            e.contains(t.target) || o();
          },
          { capture: !0 },
        ),
        c(e.dataset.value || ""));
    }
    async resolveDialogLabel(t) {
      const e = t.querySelector(".stbc-label-picker"),
        n = t.querySelector(".stbc-form-label-new");
      let s =
        "__new__" === e?.dataset.value
          ? String(n?.value || "").trim()
          : String(e?.dataset.value || "").trim();
      return (
        s &&
          (await this.addLabelOption(s).catch((t) => {
            console.warn("save calendar label option failed", t);
          })),
        s
      );
    }
    async addLabelOption(t) {
      const e = String(t || "").trim();
      if (!e) return;
      const n = Array.isArray(this.config.labelOptions)
          ? this.config.labelOptions.map((t) => String(t || "").trim()).filter(Boolean)
          : [],
        s = Array.isArray(this.config.deletedLabelOptions)
          ? this.config.deletedLabelOptions
              .map((t) => String(t || "").trim())
              .filter((t) => t && t !== e)
          : [];
      ((this.config.deletedLabelOptions = Array.from(new Set(s))),
        n.includes(e) || (this.config.labelOptions = [...n, e]),
        await this.saveData(a, this.config));
    }
    async deleteLabelOption(t) {
      const e = String(t || "").trim();
      if (!e) return;
      if (
        !window.confirm(
          `删除标签选项“${e}”？\n\n不会删除已经创建的时间块，只是不再出现在新建时的下拉选项里。`,
        )
      )
        return;
      const s = Array.isArray(this.config.labelOptions)
          ? this.config.labelOptions
              .map((t) => String(t || "").trim())
              .filter((t) => t && t !== e)
          : [],
        i = Array.isArray(this.config.deletedLabelOptions)
          ? this.config.deletedLabelOptions.map((t) => String(t || "").trim()).filter(Boolean)
          : [];
      ((this.config.labelOptions = Array.from(new Set(s))),
        (this.config.deletedLabelOptions = Array.from(new Set([...i, e]))),
        await this.saveData(a, this.config),
        (0, n.showMessage)(`已删除标签选项：${e}`));
    }
    sqlEscape(t) {
      return String(t || "").replace(/'/g, "''");
    }
    normalizeLabel(t) {
      return String(t || "")
        .replace(/^#+\s*/, "")
        .replace(/^\s*\d+[\.、]\s*/, "")
        .trim();
    }
    safeBlockText(t) {
      return String(t || "")
        .replace(/[\r\n]+/g, " ")
        .trim();
    }
    async insertMarkdownBlock(t, e, n = {}) {
      const s = {
        dataType: "markdown",
        data: e,
        ...n,
      };
      if (!s.parentID && !s.previousID && !s.nextID) s.parentID = t;
      return await u("/api/block/insertBlock", s);
    }
    async appendMarkdownBlock(t, e) {
      return await this.insertMarkdownBlock(t, e, { parentID: t });
    }
    getHeadingLevel(t) {
      const e = String(t?.subtype || "").match(/h(\d)/i);
      return e ? Number(e[1]) : 2;
    }
    async getDocBlocks(t) {
      const e = this.sqlEscape(t),
        n = await u("/api/query/sql", {
          stmt: `SELECT id, markdown, content, type, subtype, sort, parent_id FROM blocks WHERE root_id = '${e}' AND parent_id = '${e}' ORDER BY sort ASC`,
        }).catch(() => []);
      if (Array.isArray(n) && n.length) return n;
      return await u("/api/query/sql", {
        stmt: `SELECT id, markdown, content, type, subtype, sort, parent_id FROM blocks WHERE root_id = '${e}' ORDER BY sort ASC`,
      }).catch(() => []);
    }
    async findLabelHeadingInfo(t, e) {
      const n = this.normalizeLabel(e);
      if (!n) return null;
      const s = await this.getDocBlocks(t);
      const a = (s || []).findIndex(
        (t) => t.type === "h" && this.normalizeLabel(t.content || "") === n,
      );
      if (a < 0) return null;
      return {
        heading: s[a],
        index: a,
        blocks: s,
        level: this.getHeadingLevel(s[a]),
      };
    }
    getLabelSectionAnchor(t) {
      if (!t?.heading) return "";
      const e = t.blocks || [],
        n = t.level || 2;
      let s = t.heading;
      for (let a = t.index + 1; a < e.length; a++) {
        const i = e[a];
        if (i.type === "h" && this.getHeadingLevel(i) <= n) break;
        s = i;
      }
      return s?.id || t.heading.id || "";
    }
    async findLabelHeading(t, e) {
      const n = await this.findLabelHeadingInfo(t, e);
      return n?.heading?.id || "";
    }
    async ensureLabelHeading(t, e) {
      const n = this.safeBlockText(e);
      if (!n) return "";
      const s = await this.findLabelHeading(t, n);
      if (s) return s;
      const a = await this.insertMarkdownBlock(t, `## ${n}`, { parentID: t }),
        i = this.extractInsertedBlockIds(a);
      return i[0] || "";
    }
    async insertTaskAfterAnchor(t, e, n) {
      if (e) {
        try {
          return await this.insertMarkdownBlock(t, n, { previousID: e });
        } catch (s) {
          console.warn("insert task after anchor failed, fallback to document", s);
        }
      }
      return await this.insertMarkdownBlock(t, n, { parentID: t });
    }
    escapeTableCell(t) {
      return String(t ?? "")
        .replace(/\|/g, "\\|")
        .replace(/[\r\n]+/g, "<br>")
        .trim();
    }
    unescapeTableCell(t) {
      return String(t ?? "")
        .replace(/<br\s*\/?\s*>/gi, "\n")
        .replace(/\\\|/g, "|")
        .trim();
    }
    splitMarkdownTableRow(t) {
      let e = String(t || "").trim();
      if (!e.startsWith("|")) return [];
      e = e.slice(1);
      if (e.endsWith("|") && !e.endsWith("\\|")) e = e.slice(0, -1);
      const n = [];
      let s = "";
      for (let a = 0; a < e.length; a++) {
        const i = e[a];
        if ("|" === i && e[a - 1] !== "\\") {
          n.push(this.unescapeTableCell(s));
          s = "";
        } else s += i;
      }
      n.push(this.unescapeTableCell(s));
      return n.map((t) => String(t || "").trim());
    }
    isTableSeparatorRow(t) {
      return Array.isArray(t) && t.length > 0 && t.every((t) => /^:?-{3,}:?$/.test(String(t || "").trim()));
    }
    getHorizontalEventHeaders() {
      return ["事件", "开始时间", "结束时间", "标签", "颜色", "状态", "全天事件", "提醒", "备注"];
    }
    parseMarkdownTable(t) {
      const e = String(t || "")
        .split(/\r?\n/)
        .map((t) => t.trim())
        .filter((t) => t.startsWith("|"));
      for (let n = 0; n < e.length - 1; n++) {
        const s = this.splitMarkdownTableRow(e[n]),
          a = this.splitMarkdownTableRow(e[n + 1]);
        if (s.length && this.isTableSeparatorRow(a)) {
          const i = [];
          for (let t = n + 2; t < e.length; t++) {
            const n = this.splitMarkdownTableRow(e[t]);
            n.length && i.push(n);
          }
          return { headers: s, rows: i };
        }
      }
      return null;
    }
    parseEventTableMarkdown(t) {
      const e = this.parseMarkdownTable(t);
      if (!e) return null;
      const n = this.getHorizontalEventHeaders();
      const s = e.headers.map((t) => String(t || "").trim());
      const a = n.slice(0, 8);
      if (!n.every((t, e) => s[e] === t) && !a.every((t, e) => s[e] === t)) return null;
      return {
        headers: n,
        rows: (e.rows || []).map((t) => {
          const e = [...t];
          while (e.length < n.length) e.push("");
          return e.slice(0, n.length);
        }),
      };
    }
    isHorizontalEventTableMarkdown(t) {
      return Boolean(this.parseEventTableMarkdown(t));
    }
    makeTableRowEventId(t, e) {
      return `${t}__stbcrow__${e}`;
    }
    parseTableRowEventId(t) {
      const e = "__stbcrow__",
        n = String(t || ""),
        s = n.lastIndexOf(e);
      if (s < 0) return null;
      const a = n.slice(0, s),
        i = Number(n.slice(s + e.length));
      return a && Number.isInteger(i) && i >= 0 ? { tableId: a, rowIndex: i } : null;
    }
    formatEventDateTime(t) {
      const e = t instanceof Date ? t : t ? new Date(t) : null;
      return e && !Number.isNaN(e.getTime()) ? `${p(e)} ${f(e)}` : "";
    }
    parseEventDateTimeCell(t) {
      const e = String(t || "").trim().replace("T", " ");
      const n = e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})\s+(\d{1,2}):(\d{2})/);
      if (!n) return null;
      const s = new Date(Number(n[1]), Number(n[2]) - 1, Number(n[3]), Number(n[4]), Number(n[5]), 0, 0);
      return Number.isNaN(s.getTime()) ? null : s;
    }
    parseAllDayDateCell(t, e = !1) {
      const n = String(t || "").trim().replace("T", " "),
        s = n.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
      if (s) {
        const t = new Date(Number(s[1]), Number(s[2]) - 1, Number(s[3]), 0, 0, 0, 0);
        if (Number.isNaN(t.getTime())) return null;
        return e ? m(t, 1) : t;
      }
      return this.parseEventDateTimeCell(n);
    }
    getAllDayInclusiveEndDate(t) {
      const e = t instanceof Date ? new Date(t) : t ? new Date(t) : null;
      if (!e || Number.isNaN(e.getTime())) return null;
      if ("00:00" === f(e)) e.setDate(e.getDate() - 1);
      return e;
    }
    getStatusText(t) {
      return "done" === t ? "已完成" : "未完成";
    }
    parseStatusText(t) {
      const e = String(t || "").trim().toLowerCase();
      return e.includes("已完成") || e === "done" || e === "true" || e === "1" ? "done" : "todo";
    }
    getAllDayText(t) {
      return t ? "是" : "否";
    }
    parseAllDayText(t) {
      const e = String(t || "").trim().toLowerCase();
      return e === "是" || e === "true" || e === "1" || e === "yes";
    }
    parseReminderCell(t, e) {
      const n = String(t || "").trim();
      if (!n || n === "不提醒") return { reminderEnabled: !1, reminderTime: "", reminderOffset: "", reminderFired: "false", reminderFiredAt: "" };
      if (n.includes("事件开始时")) return { reminderEnabled: !0, reminderTime: g(e), reminderOffset: "0", reminderFired: "false", reminderFiredAt: "" };
      const s = n.match(/提前\s*(\d+)\s*分钟/);
      if (s) {
        const t = -Number(s[1]),
          n = new Date(e.getTime() + 60000 * t);
        return { reminderEnabled: !0, reminderTime: g(n), reminderOffset: String(t), reminderFired: "false", reminderFiredAt: "" };
      }
      const a = this.parseEventDateTimeCell(n);
      return a ? { reminderEnabled: !0, reminderTime: g(a), reminderOffset: "custom", reminderFired: "false", reminderFiredAt: "" } : { reminderEnabled: !1, reminderTime: "", reminderOffset: "", reminderFired: "false", reminderFiredAt: "" };
    }
    eventFromTableRow(t, e, n) {
      const s = this.getHorizontalEventHeaders(),
        a = Object.fromEntries(s.map((t, e) => [t, n[e] ?? ""])),
        i = this.parseAllDayText(a["全天事件"]),
        o = i ? this.parseAllDayDateCell(a["开始时间"], !1) : this.parseEventDateTimeCell(a["开始时间"]),
        r = i ? this.parseAllDayDateCell(a["结束时间"], !0) : this.parseEventDateTimeCell(a["结束时间"]);
      if (!o || !r) return null;
      const l = this.parseReminderCell(a["提醒"], o);
      const d = {
        id: this.makeTableRowEventId(t, e),
        recordBlockId: t,
        rowIndex: e,
        title: this.safeBlockText(a["事件"]) || "未命名",
        start: o,
        end: r,
        color: /^#[0-9a-fA-F]{6}$/.test(String(a["颜色"] || "")) ? String(a["颜色"]).trim() : c.value,
        label: String(a["标签"] || "").trim(),
        note: String(a["备注"] || "").trim(),
        status: this.parseStatusText(a["状态"]),
        allDay: i,
        ...l,
      };
      return this.applyTableReminderFiredState(d);
    }
    getEventRowValues(t = {}) {
      const e = t.start instanceof Date ? t.start : t.start ? new Date(t.start) : null,
        n = t.end instanceof Date ? t.end : t.end ? new Date(t.end) : null,
        s = Boolean(t.allDay),
        a = s && n ? this.getAllDayInclusiveEndDate(n) : n;
      return [
        t.title || "新时间块",
        s ? e && !Number.isNaN(e.getTime()) ? p(e) : "" : this.formatEventDateTime(e),
        s ? a && !Number.isNaN(a.getTime()) ? p(a) : "" : this.formatEventDateTime(n),
        t.label || "",
        t.color || c.value,
        this.getStatusText("done" === t.status ? "done" : "todo"),
        this.getAllDayText(s),
        t.reminderEnabled ? this.getReminderText(t) : "不提醒",
        t.note || "",
      ];
    }
    buildHorizontalEventTableMarkdown(t = []) {
      const e = this.getHorizontalEventHeaders();
      return `| ${e.map((t) => this.escapeTableCell(t)).join(" | ")} |\n| ${e.map(() => "---").join(" | ")} |${t.length ? "\n" + t.map((t) => `| ${t.map((t) => this.escapeTableCell(t)).join(" | ")} |`).join("\n") : ""}`;
    }
    getEventTableMarkdown(t = {}) {
      return this.buildHorizontalEventTableMarkdown([this.getEventRowValues(t)]);
    }
    findHorizontalEventTableInSection(t) {
      if (!t?.heading) return null;
      const e = t.blocks || [],
        n = t.level || 2;
      for (let s = t.index + 1; s < e.length; s++) {
        const a = e[s];
        if (a.type === "h" && this.getHeadingLevel(a) <= n) break;
        const i = a.markdown || a.content || "";
        if (this.isHorizontalEventTableMarkdown(i)) return a;
      }
      return null;
    }
    async getTableBlockMarkdown(t) {
      const e = this.sqlEscape(t),
        n = await u("/api/query/sql", {
          stmt: `SELECT id, markdown, content, type FROM blocks WHERE id = '${e}' LIMIT 1`,
        }).catch(() => []);
      return Array.isArray(n) && n.length ? n[0] : null;
    }
    async findGlobalHorizontalEventTable(t) {
      const e = await this.getDocBlocks(t);
      let n = "";
      for (const s of e || []) {
        const e = s.markdown || s.content || "";
        if (!this.isHorizontalEventTableMarkdown(e)) continue;
        if (!n) n = s.id;
        const a = await u("/api/attr/getBlockAttrs", { id: s.id }).catch(() => ({}));
        if ("true" === a["custom-calendar-record-table"]) return s.id;
      }
      if (n)
        await u("/api/attr/setBlockAttrs", {
          id: n,
          attrs: { "custom-calendar-record-table": "true" },
        }).catch((t) => {
          console.warn("mark existing calendar table failed", t);
        });
      return n;
    }
    async ensureHorizontalEventTableForLabel(t, e) {
      const n = this.safeBlockText(e);
      n &&
        (await this.addLabelOption(n).catch((t) => {
          console.warn("save calendar label option failed", t);
        }));
      const s = await this.findGlobalHorizontalEventTable(t);
      if (s) return s;
      const a = await this.appendMarkdownBlock(t, this.buildHorizontalEventTableMarkdown([])),
        i = this.extractInsertedBlockIds(a),
        o = i[0] || "";
      if (o)
        await u("/api/attr/setBlockAttrs", {
          id: o,
          attrs: { "custom-calendar-record-table": "true" },
        }).catch((t) => {
          console.warn("mark global calendar table failed", t);
        });
      return o;
    }
    async readHorizontalEventTable(t) {
      const e = await this.getTableBlockMarkdown(t),
        n = this.parseEventTableMarkdown(e?.markdown || e?.content || "");
      return n || { headers: this.getHorizontalEventHeaders(), rows: [] };
    }
    async insertEventTableBlockForLabel(t, e, n) {
      const s = await this.ensureHorizontalEventTableForLabel(t, e),
        a = await this.readHorizontalEventTable(s),
        i = a.rows.length;
      a.rows.push(this.getEventRowValues(n));
      await u("/api/block/updateBlock", {
        id: s,
        dataType: "markdown",
        data: this.buildHorizontalEventTableMarkdown(a.rows),
      });
      return { eventId: this.makeTableRowEventId(s, i), tableBlockId: s, rowIndex: i };
    }
    async updateEventRowFromEvent(t, e = {}) {
      const n = this.parseTableRowEventId(t);
      if (!n) return null;
      const tableWritePrior = this.tableWriteQueues?.get(n.tableId);
      let releaseTableWrite = () => {};
      const tableWriteToken = new Promise((resolve) => (releaseTableWrite = resolve)),
        tableWriteQueued = (tableWritePrior || Promise.resolve()).catch(() => {}).then(() => tableWriteToken);
      this.tableWriteQueues?.set(n.tableId, tableWriteQueued);
      tableWritePrior && (await tableWritePrior.catch(() => {}));
      try {
      const s = await this.readHorizontalEventTable(n.tableId),
        a = s.rows[n.rowIndex];
      if (!a) throw new Error("找不到对应的表格行");
      const i = this.eventFromTableRow(n.tableId, n.rowIndex, a) || {},
        o = {
          ...i,
          ...e,
          id: t,
          recordBlockId: n.tableId,
          rowIndex: n.rowIndex,
        };
      s.rows[n.rowIndex] = this.getEventRowValues(o);
      await u("/api/block/updateBlock", {
        id: n.tableId,
        dataType: "markdown",
        data: this.buildHorizontalEventTableMarkdown(s.rows),
      });
      return o;
      } finally {
        releaseTableWrite();
        this.tableWriteQueues?.get(n.tableId) === tableWriteQueued && this.tableWriteQueues.delete(n.tableId);
      }
    }
    async deleteEventRow(t) {
      const e = this.parseTableRowEventId(t);
      if (!e) return !1;
      const n = await this.readHorizontalEventTable(e.tableId);
      if (!n.rows[e.rowIndex]) return !1;
      n.rows.splice(e.rowIndex, 1);
      await u("/api/block/updateBlock", {
        id: e.tableId,
        dataType: "markdown",
        data: this.buildHorizontalEventTableMarkdown(n.rows),
      });
      return !0;
    }
    async loadHorizontalTableEvents(t, e) {
      const n = await u("/api/query/sql", {
        stmt: "SELECT id, markdown, content, type FROM blocks WHERE (markdown LIKE '%开始时间%' OR content LIKE '%开始时间%') LIMIT 2000",
      }).catch(() => []),
        s = [];
      for (const a of n || []) {
        const n = this.parseEventTableMarkdown(a.markdown || a.content || "");
        if (!n) continue;
        n.rows.forEach((n, i) => {
          const o = this.eventFromTableRow(a.id, i, n);
          o && o.end > t && o.start < e && s.push(o);
        });
      }
      return s;
    }
    async insertTaskBlockForLabel(t, e, n) {
      return await this.insertEventTableBlockForLabel(t, e, {
        title: n,
        label: e,
        status: "todo",
        allDay: !1,
      });
    }
    async setEventReminderAttrs(t, e = {}) {
      if (this.parseTableRowEventId(t)) return;
      await u("/api/attr/setBlockAttrs", {
        id: t,
        attrs: {
          "custom-calendar-reminder-enabled": e.reminderEnabled ? "true" : "false",
          "custom-calendar-reminder-time": e.reminderTime || "",
          "custom-calendar-reminder-offset": e.reminderOffset || "",
          "custom-calendar-reminder-fired": e.reminderFired || "false",
          "custom-calendar-reminder-fired-at": e.reminderFiredAt || "",
        },
      });
    }
    async rewriteEventRecordBlock(t, e = {}, s = {}) {
      if (this.parseTableRowEventId(t)) {
        return await this.updateEventRowFromEvent(t, e);
      }
      const a = this.events.find((e) => e.id === t),
        i = await u("/api/attr/getBlockAttrs", { id: t }).catch(() => ({})),
        o = e.start || a?.start || i["custom-calendar-start"],
        r = e.end || a?.end || i["custom-calendar-end"],
        l = o instanceof Date ? o : o ? new Date(o) : new Date(),
        d = r instanceof Date ? r : r ? new Date(r) : new Date(l.getTime() + 30 * 60000),
        h = {
          title: e.title || a?.title || i["custom-calendar-title"] || "新时间块",
          start: l,
          end: d,
          color: e.color || a?.color || i["custom-calendar-color"] || c.value,
          label: e.label ?? a?.label ?? i["custom-calendar-label"] ?? "",
          note: e.note ?? a?.note ?? i["custom-calendar-note"] ?? "",
          status: "done" === (e.status || a?.status || i["custom-calendar-status"]) ? "done" : "todo",
          allDay: typeof e.allDay === "boolean" ? e.allDay : typeof a?.allDay === "boolean" ? a.allDay : "true" === i["custom-calendar-all-day"],
          reminderEnabled: typeof e.reminderEnabled === "boolean" ? e.reminderEnabled : typeof a?.reminderEnabled === "boolean" ? a.reminderEnabled : "true" === i["custom-calendar-reminder-enabled"],
          reminderTime: e.reminderTime ?? a?.reminderTime ?? i["custom-calendar-reminder-time"] ?? "",
          reminderOffset: e.reminderOffset ?? a?.reminderOffset ?? i["custom-calendar-reminder-offset"] ?? "",
          reminderFired: e.reminderFired ?? a?.reminderFired ?? i["custom-calendar-reminder-fired"] ?? "false",
          reminderFiredAt: e.reminderFiredAt ?? a?.reminderFiredAt ?? i["custom-calendar-reminder-fired-at"] ?? "",
        };
      await u("/api/block/updateBlock", {
        id: t,
        dataType: "markdown",
        data: this.getEventTableMarkdown(h),
      });
      if (s.writeAttrs) {
        await this.setEventAttrs(t, h.title, h.start, h.end, h.color, h.label, h.status, h.allDay, h.note);
        await this.setEventReminderAttrs(t, h).catch((t) => {
          console.warn("restore reminder attrs after table rewrite failed", t);
        });
      }
      return h;
    }
    async openCreateEventDialogV2(t, e, s) {
      const a = this.minutesToDate(t, e),
        i = this.minutesToDate(t, s),
        o = r
          .map(
            (t) =>
              `\n      <label class="stbc-color-choice" title="${t.name}">\n        <input type="radio" name="stbc-event-color" value="${t.value}" ${t.value === c.value ? "checked" : ""} />\n        <span style="--stbc-choice-color:${t.value};--stbc-choice-bg:${t.bg};"></span>\n      </label>\n    `,
          )
          .join(""),
        l = new n.Dialog({
          title: "新建时间块",
          content: `\n        <div class="stbc-form">\n          <label class="stbc-form-row">\n            <span>标题</span>\n            <input class="b3-text-field stbc-form-title" value="新时间块" />\n          </label>\n          <div class="stbc-form-row stbc-form-time-row">\n            <label><span>开始</span><input class="b3-text-field stbc-form-start" type="time" value="${f(a)}" /></label>\n            <label><span>结束</span><input class="b3-text-field stbc-form-end" type="time" value="${f(i)}" /></label>\n          </div>\n          ${this.renderLabelPickerHTML()}\n          <div class="stbc-form-row">\n            <span>颜色</span>\n            <div class="stbc-color-grid">${o}</div>\n          </div>\n          <label class="stbc-form-row stbc-form-note-row">\n            <span>备注：</span>\n            <textarea class="b3-text-field stbc-form-note" rows="3" placeholder="写点备注，鼠标悬停时间块时会显示"></textarea>\n          </label>\n          <div class="stbc-form-actions">\n            <button class="b3-button b3-button--cancel stbc-form-cancel">取消</button>\n            <button class="b3-button b3-button--text stbc-form-submit">创建</button>\n          </div>\n        </div>\n      `,
          width: "500px",
        }),
        d = l.element,
        u = d.querySelector(".stbc-form-title"),
        h = d.querySelector(".stbc-form-start"),
        m = d.querySelector(".stbc-form-end"),
        b = d.querySelector(".stbc-form-label"),
        noteInput = d.querySelector(".stbc-form-note"),
        v = d.querySelector(".stbc-form-submit");
      d?.classList.add("stbc-glass-dialog");
      d?.querySelector(".b3-dialog__close")?.addEventListener("click", (t) => { t.preventDefault(); t.stopPropagation(); l.destroy(); }, { capture: true });
      this.bindCreateDialogDuration(d, h, m);
      (this.bindLabelPicker(d),
        u?.focus(),
        u?.select(),
        d
          .querySelector(".stbc-form-cancel")
          ?.addEventListener("click", () => l.destroy()),
        v?.addEventListener("click", async () => {
          const e = u?.value.trim() || "新时间块",
            s = this.timeInputToMinutes(h?.value || f(a)),
            o = this.timeInputToMinutes(m?.value || f(i)),
            r =
              d.querySelector('input[name="stbc-event-color"]:checked')
                ?.value || c.value,
            note = String(noteInput?.value || "").trim(),
            p = await this.resolveDialogLabel(d);
          if (Number.isNaN(s) || Number.isNaN(o))
            (0, n.showMessage)("请填写有效的开始和结束时间");
          else if (o <= s) (0, n.showMessage)("结束时间必须晚于开始时间");
          else {
            v.disabled = !0;
            try {
              const n = await this.createEvent(
                t,
                s - 60 * this.config.dayStartHour,
                o - 60 * this.config.dayStartHour,
                e,
                r,
                p,
                !1,
                note,
              );
              (this.events.push(n),
                l.destroy(),
                this.renderMainViewV2(),
                this.renderMiniMonthV2());
            } catch (t) {
              (console.error("create calendar event failed", t),
                (0, n.showMessage)(
                  `创建时间块失败：${t instanceof Error ? t.message : String(t)}`,
                ),
                (v.disabled = !1));
            }
          }
        }));
    }
    async openCreateAllDayDialog(t, e) {
      const s = r
          .map(
            (t) =>
              `\n      <label class="stbc-color-choice" title="${t.name}">\n        <input type="radio" name="stbc-event-color" value="${t.value}" ${t.value === c.value ? "checked" : ""} />\n        <span style="--stbc-choice-color:${t.value};--stbc-choice-bg:${t.bg};"></span>\n      </label>\n    `,
          )
          .join(""),
        a = new n.Dialog({
          title: "新建全天事件",
          content: `\n        <div class="stbc-form">\n          <label class="stbc-form-row">\n            <span>标题</span>\n            <input class="b3-text-field stbc-form-title" value="全天事件" />\n          </label>\n          <label class="stbc-form-row">\n            <span>日期</span>\n            <input class="b3-text-field" value="${t === e ? t : `${t} - ${e}`}" disabled />\n          </label>\n          ${this.renderLabelPickerHTML()}\n          <div class="stbc-form-row">\n            <span>颜色</span>\n            <div class="stbc-color-grid">${s}</div>\n          </div>\n          <label class="stbc-form-row stbc-form-note-row">\n            <span>备注：</span>\n            <textarea class="b3-text-field stbc-form-note" rows="3" placeholder="写点备注，鼠标悬停时间块时会显示"></textarea>\n          </label>\n          <div class="stbc-form-actions">\n            <button class="b3-button b3-button--cancel stbc-form-cancel">取消</button>\n            <button class="b3-button b3-button--text stbc-form-submit">创建</button>\n          </div>\n        </div>\n      `,
          width: "430px",
        }),
        i = a.element,
        o = i.querySelector(".stbc-form-title"),
        l = i.querySelector(".stbc-form-label"),
        noteInput = i.querySelector(".stbc-form-note"),
        d = i.querySelector(".stbc-form-submit");
      i?.classList.add("stbc-glass-dialog");
      i?.querySelector(".b3-dialog__close")?.addEventListener("click", (t) => { t.preventDefault(); t.stopPropagation(); a.destroy(); }, { capture: true });
      (o?.focus(),
        o?.select(),
        this.bindLabelPicker(i),
        i
          .querySelector(".stbc-form-cancel")
          ?.addEventListener("click", () => a.destroy()),
        d?.addEventListener("click", async () => {
          d.disabled = !0;
          try {
            const n = o?.value.trim() || "全天事件",
              s =
                i.querySelector('input[name="stbc-event-color"]:checked')
                  ?.value || c.value,
              note = String(noteInput?.value || "").trim(),
              r = await this.resolveDialogLabel(i),
              d = Math.max(
                1,
                Math.floor(
                  (new Date(`${e}T00:00:00`).getTime() -
                    new Date(`${t}T00:00:00`).getTime()) /
                    864e5,
                ) + 1,
              ),
              u = await this.createEvent(
                t,
                60 * -this.config.dayStartHour,
                24 * d * 60 - 60 * this.config.dayStartHour,
                n,
                s,
                r,
                !0,
                note,
              );
            (this.events.push(u),
              a.destroy(),
              this.renderCurrentViewFromState());
          } catch (t) {
            (console.error("create all-day calendar event failed", t),
              (0, n.showMessage)(
                `创建全天事件失败：${t instanceof Error ? t.message : String(t)}`,
              ),
              (d.disabled = !1));
          }
        }));
    }

    async collectAllCalendarEvents() {
      const t = new Map(),
        e = (e, n = {}) => {
          const s = this.normalizeBackupEvent(e);
          if (!s) return;
          const a = this.buildEventImportKey(s),
            i = { ...s, source: n };
          if (!t.has(a)) {
            t.set(a, i);
            return;
          }
          const o = t.get(a);
          (!o.reminderEnabled && i.reminderEnabled) || "attr" === n.kind ? t.set(a, { ...o, ...i }) : null;
        };
      const s = await u("/api/query/sql", {
        stmt: "SELECT id, markdown, content, type, root_id FROM blocks WHERE (markdown LIKE '%开始时间%' OR content LIKE '%开始时间%') LIMIT 10000",
      }).catch(() => []);
      for (const t of s || []) {
        const n = this.parseEventTableMarkdown(t.markdown || t.content || "");
        if (!n) continue;
        n.rows.forEach((n, s) => {
          const a = this.eventFromTableRow(t.id, s, n);
          a && e(a, { kind: "table", tableBlockId: t.id, rowIndex: s, rootId: t.root_id || "" });
        });
      }
      const a = await u("/api/query/sql", {
        stmt: "SELECT block_id, value FROM attributes WHERE name = 'custom-calendar-start' ORDER BY value ASC LIMIT 10000",
      }).catch(() => []);
      for (const t of a || []) {
        const s = await u("/api/attr/getBlockAttrs", { id: t.block_id }).catch(() => ({})),
          a = await this.getTaskBlockRow(t.block_id),
          i = new Date(s["custom-calendar-start"] || t.value),
          o = new Date(s["custom-calendar-end"] || i.getTime() + 18e5);
        if (Number.isNaN(i.getTime()) || Number.isNaN(o.getTime())) continue;
        e(
          {
            id: t.block_id,
            title: s["custom-calendar-title"] || this.getTaskTitleFromBlockRow(a) || "未命名",
            start: i,
            end: o,
            color: s["custom-calendar-color"] || c.value,
            label: s["custom-calendar-label"] || "",
            note: s["custom-calendar-note"] || "",
            status: this.getTaskStatusFromBlockRow(a) || s["custom-calendar-status"] || "todo",
            allDay: "true" === s["custom-calendar-all-day"],
            reminderEnabled: "true" === s["custom-calendar-reminder-enabled"],
            reminderTime: s["custom-calendar-reminder-time"] || "",
            reminderOffset: s["custom-calendar-reminder-offset"] || "",
            reminderFired: s["custom-calendar-reminder-fired"] || "false",
            reminderFiredAt: s["custom-calendar-reminder-fired-at"] || "",
          },
          { kind: "attr", blockId: t.block_id },
        );
      }
      return Array.from(t.values()).sort((t, e) => t.start - e.start);
    }
    serializeCalendarEvent(t) {
      const e = t.start instanceof Date ? t.start : new Date(t.start),
        n = t.end instanceof Date ? t.end : new Date(t.end);
      return {
        title: t.title || "新时间块",
        start: g(e),
        end: g(n),
        label: t.label || "",
        note: t.note || "",
        color: t.color || c.value,
        status: "done" === t.status ? "done" : "todo",
        allDay: Boolean(t.allDay),
        reminderEnabled: Boolean(t.reminderEnabled),
        reminderTime: t.reminderTime || "",
        reminderOffset: t.reminderOffset || "",
        reminderFired: t.reminderFired || "false",
        reminderFiredAt: t.reminderFiredAt || "",
        source: t.source || undefined,
      };
    }
    async buildFullBackup() {
      const t = await this.collectAllCalendarEvents();
      return {
        app: "siyuan-time-block-calendar",
        formatVersion: 1,
        pluginVersion: "0.5.5-clean",
        exportedAt: g(new Date()),
        config: { ...this.config },
        events: t.map((t) => this.serializeCalendarEvent(t)),
        summary: {
          events: t.length,
          labels: Array.isArray(this.config.labelOptions) ? this.config.labelOptions.length : 0,
        },
      };
    }
    downloadTextFile(t, e, n = "application/json") {
      const s = new Blob([e], { type: `${n};charset=utf-8` }),
        a = window.URL.createObjectURL(s),
        i = document.createElement("a");
      ((i.href = a), (i.download = t), (i.style.display = "none"), document.body.appendChild(i), i.click(), i.remove(), window.setTimeout(() => window.URL.revokeObjectURL(a), 1500));
    }
    async exportAllData() {
      try {
        const e = await this.buildFullBackup(),
          s = new Date(),
          a = `time-block-calendar-backup-${p(s)}-${v(s.getHours())}${v(s.getMinutes())}.json`;
        this.downloadTextFile(a, JSON.stringify(e, null, 2));
        (0, n.showMessage)(`已导出 JSON 备份：${e.summary.events} 个时间块`);
      } catch (t) {
        (console.error("export calendar backup failed", t),
          (0, n.showMessage)(`导出失败：${t instanceof Error ? t.message : String(t)}`));
      }
    }
    readTextFile(t) {
      return new Promise((e, n) => {
        const s = new FileReader();
        ((s.onload = () => e(String(s.result || ""))),
          (s.onerror = () => n(s.error || new Error("读取文件失败"))),
          s.readAsText(t, "utf-8"));
      });
    }
    normalizeBackupObject(t) {
      if (Array.isArray(t)) return { events: t, config: {} };
      if (!t || "object" != typeof t) throw new Error("备份文件不是有效的 JSON 对象");
      const e = t.events || t.calendarEvents || t.timeBlocks || [],
        n = t.config || t.settings || {};
      return {
        events: Array.isArray(e) ? e : [],
        config: n && "object" == typeof n ? n : {},
      };
    }
    normalizeBackupDateTime(t) {
      if (!t) return null;
      if (t instanceof Date) return Number.isNaN(t.getTime()) ? null : t;
      if ("number" == typeof t) {
        const e = new Date(t);
        return Number.isNaN(e.getTime()) ? null : e;
      }
      let e = String(t || "").trim();
      if (!e) return null;
      let n = new Date(e);
      if (Number.isNaN(n.getTime()) && /^\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}/.test(e)) n = new Date(e.replace(/\s+/, "T"));
      if (Number.isNaN(n.getTime()) && /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(e)) n = new Date(`${this.normalizeImportDate(e)}T00:00:00`);
      return Number.isNaN(n.getTime()) ? null : n;
    }
    normalizeBackupEvent(t) {
      if (!t || "object" != typeof t) return null;
      const e = this.normalizeBackupDateTime(t.start || t.startTime || t.begin || t["开始时间"]),
        n = this.normalizeBackupDateTime(t.end || t.endTime || t.finish || t["结束时间"]);
      if (!e || !n || n <= e) return null;
      const s = String(t.label ?? t["标签"] ?? "").trim(),
        a = t.reminder || t["提醒"] || "",
        i = "object" == typeof a && a ? a : {},
        o = "string" == typeof a ? this.parseReminderCell(a, e) : {};
      const r = t.reminderEnabled ?? i.enabled ?? o.reminderEnabled ?? false;
      return {
        title: this.safeBlockText(t.title || t.name || t.event || t["事件"] || "新时间块"),
        start: e,
        end: n,
        label: s,
        note: String(t.note ?? t.remark ?? t["备注"] ?? "").trim(),
        color: this.normalizeImportColor(t.color || t["颜色"] || c.value, s),
        status: this.parseStatusText(t.status || t["状态"] || "todo"),
        allDay: typeof t.allDay === "boolean" ? t.allDay : this.parseAllDayText(t.allDay ?? t["全天事件"] ?? "false"),
        reminderEnabled: typeof r === "boolean" ? r : this.parseAllDayText(r),
        reminderTime: String(t.reminderTime ?? i.time ?? o.reminderTime ?? ""),
        reminderOffset: String(t.reminderOffset ?? i.offset ?? o.reminderOffset ?? ""),
        reminderFired: String(t.reminderFired ?? i.fired ?? o.reminderFired ?? "false"),
        reminderFiredAt: String(t.reminderFiredAt ?? i.firedAt ?? o.reminderFiredAt ?? ""),
      };
    }
    buildEventImportKey(t) {
      const e = t.start instanceof Date ? t.start : new Date(t.start),
        n = t.end instanceof Date ? t.end : new Date(t.end);
      return [g(e), g(n), this.safeBlockText(t.title).toLowerCase(), String(t.label || "").trim().toLowerCase(), Boolean(t.allDay) ? "1" : "0"].join("|");
    }
    minutesFromDayStart(t, e) {
      const n = new Date(`${e}T00:00:00`);
      return (n.setHours(this.config.dayStartHour, 0, 0, 0), Math.round((t.getTime() - n.getTime()) / 60000));
    }
    sanitizeImportedConfig(t) {
      const e = { ...this.config };
      if (!t || "object" != typeof t) return e;
      const n = ["notebookId", "dailyRootHPath", "dayStartHour", "dayEndHour", "slotMinutes", "desktopNotificationEnabled", "desktopNotificationMissedEnabled", "pomodoroVisible"];
      n.forEach((n) => {
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      });
      Array.isArray(t.labelOptions) && (e.labelOptions = Array.from(new Set(t.labelOptions.map((t) => String(t || "").trim()).filter(Boolean))));
      Array.isArray(t.deletedLabelOptions) && (e.deletedLabelOptions = Array.from(new Set(t.deletedLabelOptions.map((t) => String(t || "").trim()).filter(Boolean))));
      t.tableReminderFiredMap && "object" == typeof t.tableReminderFiredMap && !Array.isArray(t.tableReminderFiredMap) && (e.tableReminderFiredMap = { ...t.tableReminderFiredMap });
      e.dailyRootHPath = String(e.dailyRootHPath || "/daily note").trim() || "/daily note";
      e.dayStartHour = Math.max(0, Math.min(23, Number(e.dayStartHour || 6)));
      e.dayEndHour = Math.max(e.dayStartHour + 1, Math.min(24, Number(e.dayEndHour || 24)));
      e.slotMinutes = [5, 10, 15, 20, 30, 60].includes(Number(e.slotMinutes)) ? Number(e.slotMinutes) : 15;
      return e;
    }
    async importFullBackup(t, e = {}) {
      const n = this.normalizeBackupObject(t),
        s = { config: !1, events: { ok: 0, skipped: 0, fail: 0 } };
      if (e.importConfig) {
        this.config = this.sanitizeImportedConfig(n.config);
        await this.saveData(a, this.config);
        s.config = !0;
      }
      e.importEvents && (s.events = await this.importBackupEvents(n.events, { skipDuplicates: e.skipDuplicates }));
      return s;
    }



    openImportDialog() {
      const t = new n.Dialog({
        title: "导入 / 导出数据",
        content: `
        <div class="stbc-import-form">
          <div class="stbc-import-tip">
            <b>时间块备份：</b>JSON 文件，只包含插件设置/标签、时间块和提醒信息。<br />
          </div>
          <div class="stbc-import-export-row">
            <button class="b3-button stbc-import-export-json" type="button">导出时间块 JSON</button>
          </div>
          <label class="stbc-import-file">
            <span>选择备份文件</span>
            <input class="b3-text-field stbc-import-file-input" type="file" accept=".json,application/json" />
          </label>
          <div class="stbc-import-options">
            <label><input type="checkbox" class="stbc-import-events" checked /> 导入时间块</label>
            <label><input type="checkbox" class="stbc-import-config" checked /> 恢复插件设置和标签</label>
            <label><input type="checkbox" class="stbc-import-skip" checked /> 跳过已存在的重复时间块</label>
          </div>
          <details class="stbc-import-details">
            <summary>JSON 备份文件会长什么样？</summary>
            <pre>{
  "app": "siyuan-time-block-calendar",
  "formatVersion": 1,
  "config": { "dailyRootHPath": "/daily note" },
  "events": [
    { "title": "背单词", "start": "2026-05-02T10:30:00+08:00", "end": "2026-05-02T11:30:00+08:00", "label": "英语" }
  ],
  "summary": { "events": 1 }
}</pre>
          </details>
          <div class="stbc-form-actions">
            <button class="b3-button b3-button--cancel stbc-import-cancel">取消</button>
            <button class="b3-button b3-button--text stbc-import-submit">导入文件</button>
          </div>
        </div>
      `,
        width: "720px",
      }),
        e = t.element,
        s = e.querySelector(".stbc-import-file-input"),
        i = e.querySelector(".stbc-import-submit");
      (e?.classList.add("stbc-glass-dialog"),
        e?.querySelector(".b3-dialog__close")?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); t.destroy(); }, { capture: true }),
        e.querySelector(".stbc-import-cancel")?.addEventListener("click", () => t.destroy()),
        e.querySelector(".stbc-import-export-json")?.addEventListener("click", () => this.exportAllData()),
        i?.addEventListener("click", async () => {
          const o = s?.files?.[0];
          if (!o) return void (0, n.showMessage)("请先选择一个 .json 文件");
          i.disabled = !0;
          try {
            const s = await this.readTextFile(o),
              r = String(o.name || "").toLowerCase();
            if (!r.endsWith(".json")) throw new Error("只支持导入 JSON 备份文件");
            const l = JSON.parse(s),
              d = {
                importEvents: Boolean(e.querySelector(".stbc-import-events")?.checked),
                importConfig: Boolean(e.querySelector(".stbc-import-config")?.checked),
                skipDuplicates: Boolean(e.querySelector(".stbc-import-skip")?.checked),
              },
              h = this.normalizeBackupObject(l);
            if (!h.events.length && !Object.keys(h.config || {}).length) throw new Error("备份文件为空或格式不正确");
            if (!window.confirm(`确认导入这个备份文件？

时间块：${h.events.length} 条

默认会跳过重复时间块，不会删除现有数据。`)) return void (i.disabled = !1);
            const m = await this.importFullBackup(l, d);
            (t.destroy(), await this.render(), (0, n.showMessage)(`导入完成：时间块新增 ${m.events.ok} 条，跳过 ${m.events.skipped} 条，失败 ${m.events.fail} 条${m.config ? "；设置已恢复" : ""}`));
          } catch (t) {
            (console.error("import calendar backup failed", t), (0, n.showMessage)(`导入失败：${t instanceof Error ? t.message : String(t)}`), (i.disabled = !1));
          }
        }));
    }
    splitCSVLine(t) {
      const e = [];
      let n = "", s = !1;
      for (let a = 0; a < t.length; a++) {
        const i = t[a];
        if ('"' === i) {
          if (s && '"' === t[a + 1]) {
            n += '"';
            a++;
          } else s = !s;
        } else if ("," === i && !s) {
          e.push(n.trim());
          n = "";
        } else n += i;
      }
      return (e.push(n.trim()), e);
    }
    parseImportCSV(t) {
      const e = String(t || "").replace(/^\ufeff/, "").split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
      if (!e.length) return [];
      const n = this.splitCSVLine(e[0]).map((t) => t.trim().toLowerCase()),
        s = ["date", "start", "end", "title"],
        a = s.every((t) => n.includes(t));
      if (!a) throw new Error("第一行必须包含 date,start,end,title 表头");
      return e.slice(1).map((t, e) => {
        const s = this.splitCSVLine(t), a = {};
        n.forEach((t, e) => {
          a[t] = s[e] || "";
        });
        return {
          date: a.date,
          start: a.start,
          end: a.end,
          title: a.title,
          label: a.label || "",
          color: a.color || "",
          status: a.status || "todo",
          allDay: a.allday || a["all_day"] || "false",
          rowNo: e + 2,
        };
      }).filter((t) => t.date || t.title);
    }
    normalizeImportDate(t) {
      const e = String(t || "").trim().replace(/[./]/g, "-");
      const n = e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (!n) return "";
      return `${n[1]}-${v(Number(n[2]))}-${v(Number(n[3]))}`;
    }
    parseImportTimeToMinutes(t) {
      const e = String(t || "").trim();
      const n = e.match(/^(\d{1,2}):(\d{2})$/);
      if (!n) return NaN;
      const s = Number(n[1]), a = Number(n[2]);
      return s >= 0 && s <= 23 && a >= 0 && a <= 59 ? 60 * s + a : NaN;
    }
    normalizeImportColor(t, e = "") {
      const n = String(t || "").trim();
      if (/^#[0-9a-fA-F]{6}$/.test(n)) return n;
      const s = r.find((t) => t.name === n || t.value.toLowerCase() === n.toLowerCase());
      if (s) return s.value;
      const a = String(e || "");
      if (a.includes("数学")) return "#38bdf8";
      if (a.includes("英语")) return "#22c55e";
      if (a.includes("自控") || a.includes("专业")) return "#8b5cf6";
      if (a.includes("健身")) return "#84cc16";
      return c.value;
    }
    async importCalendarRows(t) {
      let e = 0, s = 0;
      for (const a of t) {
        try {
          const t = this.normalizeImportDate(a.date),
            o = this.parseImportTimeToMinutes(a.start),
            r = this.parseImportTimeToMinutes(a.end),
            l = this.safeBlockText(a.title) || "导入时间块",
            d = String(a.label || "").trim(),
            h = this.normalizeImportColor(a.color, d),
            m = /^true|1|yes|y|是$/i.test(String(a.allDay || "")),
            b = "done" === String(a.status || "").toLowerCase() ? "done" : "todo";
          if (!t) throw new Error(`第 ${a.rowNo} 行日期格式不正确`);
          if (!m && (Number.isNaN(o) || Number.isNaN(r) || r <= o)) throw new Error(`第 ${a.rowNo} 行时间格式不正确`);
          const v = m ? 0 - 60 * this.config.dayStartHour : o - 60 * this.config.dayStartHour,
            p = m ? 24 * 60 - 60 * this.config.dayStartHour : r - 60 * this.config.dayStartHour,
            f = await this.createEvent(t, v, p, l, h, d, m);
          if ("done" === b) {
            await this.syncTaskCheckbox(f.id, "done").catch((t) => console.warn("sync imported done status failed", t));
            await this.setEventAttrs(f.id, l, f.start, f.end, h, d, "done", m);
          }
          e++;
        } catch (t) {
          (s++, console.warn("import row failed", a, t));
        }
      }
      return { ok: e, fail: s };
    }

    bindToolbar() {
      (this.rootElement
        ?.querySelector('[data-action="view"]')
        ?.addEventListener("change", (t) => {
          ((this.viewMode = t.target.value),
            (this.lastCalendarViewMode = this.viewMode),
            this.render());
        }),
        this.rootElement
          ?.querySelector('[data-action="today"]')
          ?.addEventListener("click", () => {
            ((this.currentDate = new Date()), this.render());
          }),
        this.rootElement
          ?.querySelector('[data-action="ai-open"]')
          ?.addEventListener("click", () => this.openAiDialog()),
        this.rootElement
          ?.querySelector('[data-action="goals"]')
          ?.addEventListener("click", () => {
            "goals" === this.viewMode
              ? (this.viewMode = this.lastCalendarViewMode || "month")
              : (["week", "three", "month", "year"].includes(this.viewMode) &&
                  (this.lastCalendarViewMode = this.viewMode),
                (this.viewMode = "goals"));
            this.render();
          }),
        this.rootElement
          ?.querySelector('[data-action="important-days"]')
          ?.addEventListener("click", () => {
            "important-days" === this.viewMode
              ? (this.viewMode = this.lastCalendarViewMode || "week")
              : (["week", "three", "month", "year"].includes(this.viewMode) &&
                  (this.lastCalendarViewMode = this.viewMode),
                (this.viewMode = "important-days"));
            this.render();
          }),
        this.rootElement
          ?.querySelector('[data-action="prev"]')
          ?.addEventListener("click", () => {
            ((this.currentDate =
              "week" === this.viewMode
                ? m(this.getVisibleWeekAnchorDate?.() || this.currentDate, -7)
                : "three" === this.viewMode
                  ? m(this.currentDate, -3)
                  : "year" === this.viewMode
                  ? new Date(
                      this.currentDate.getFullYear() - 1,
                      this.currentDate.getMonth(),
                      1,
                    )
                  : new Date(
                      this.currentDate.getFullYear(),
                      this.currentDate.getMonth() - 1,
                      1,
                    )),
              this.render());
          }),
        this.rootElement
          ?.querySelector('[data-action="next"]')
          ?.addEventListener("click", () => {
            ((this.currentDate =
              "week" === this.viewMode
                ? m(this.getVisibleWeekAnchorDate?.() || this.currentDate, 7)
                : "three" === this.viewMode
                  ? m(this.currentDate, 3)
                  : "year" === this.viewMode
                  ? new Date(
                      this.currentDate.getFullYear() + 1,
                      this.currentDate.getMonth(),
                      1,
                    )
                  : new Date(
                      this.currentDate.getFullYear(),
                      this.currentDate.getMonth() + 1,
                      1,
                    )),
              this.render());
          }),
        this.rootElement
          ?.querySelector('[data-action="settings"]')
          ?.addEventListener("click", () => this.openImportDialog()),
        this.rootElement
          ?.querySelector('[data-action="refresh"]')
          ?.addEventListener("click", () => this.render()));
    }
    bindHorizontalWheelScroll() {
      const t = this.rootElement?.querySelector(".stbc-main");
      if (!t) return;
      t.addEventListener(
        "wheel",
        (e) => {
          if (e.target?.closest?.("button, input, select, textarea, .stbc-sidebar, .stbc-inspector")) return;
          const n = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
          if (!n || Math.abs(n) < 2 || Math.abs(n) < Math.abs(e.deltaY) * 0.55) return;
          const s = t.scrollWidth - t.clientWidth;
          if (s <= 0) return;
          const a = t.scrollLeft,
            i = Math.max(0, Math.min(s, a + n));
          if (i === a) return void this.queueWeekBufferRecycle?.(21);
          (e.preventDefault(), (t.scrollLeft = i), this.queueVisibleDateSyncFromScroll(), this.queueWeekBufferRecycle?.(21));
        },
        { passive: false },
      );
    }
    async loadEvents() {
      const loadToken = (this.loadEventsToken || 0) + 1;
      this.loadEventsToken = loadToken;
      const t =
          "week" === this.viewMode
            ? m(b(this.currentDate), -21)
            : "three" === this.viewMode
              ? h(this.currentDate)
              : "year" === this.viewMode
              ? new Date(this.currentDate.getFullYear(), 0, 1)
              : new Date(
                  this.currentDate.getFullYear(),
                  this.currentDate.getMonth(),
                  1,
                ),
        e =
          "week" === this.viewMode
            ? m(t, 49)
            : "three" === this.viewMode
              ? m(t, 3)
              : "year" === this.viewMode
              ? new Date(this.currentDate.getFullYear() + 1, 0, 1)
              : new Date(
                  this.currentDate.getFullYear(),
                  this.currentDate.getMonth() + 1,
                  1,
                ),
        n = `
      SELECT block_id, value
      FROM attributes
      WHERE name = 'custom-calendar-start'
        AND value < '${g(e)}'
      ORDER BY value ASC
    `;
      let s = [];
      try {
        s = await u("/api/query/sql", { stmt: n });
      } catch (t) {
        (console.warn("calendar query failed", t), (s = []));
      }
      const a = [],
        i = Date.now(),
        rangeStart = t,
        rangeEnd = e;
      for (const [t, e] of this.recentlyDeletedEventIds.entries())
        i - e > 15e3 && this.recentlyDeletedEventIds.delete(t);
      for (const t of s || []) {
        if (this.recentlyDeletedEventIds.has(t.block_id)) continue;
        const e = await u("/api/attr/getBlockAttrs", { id: t.block_id }).catch(
            () => ({}),
          ),
          n = await this.getTaskBlockRow(t.block_id),
          s = new Date(e["custom-calendar-start"] || t.value),
          i = new Date(e["custom-calendar-end"] || s.getTime() + 18e5),
          r = e["custom-calendar-title"] || this.getTaskTitleFromBlockRow(n) || "未命名",
          o = await this.syncEventAttrStatusFromTask(
            t.block_id,
            e["custom-calendar-status"],
            n,
            r,
          );
        if (Number.isNaN(s.getTime()) || Number.isNaN(i.getTime()) || i <= rangeStart || s >= rangeEnd) continue;
        a.push({
          id: t.block_id,
          title: r,
          start: s,
          end: i,
          color: e["custom-calendar-color"],
          label: e["custom-calendar-label"],
          note: e["custom-calendar-note"] || "",
          status: o,
          allDay: "true" === e["custom-calendar-all-day"],
          reminderEnabled: "true" === e["custom-calendar-reminder-enabled"],
          reminderTime: e["custom-calendar-reminder-time"] || "",
          reminderOffset: e["custom-calendar-reminder-offset"] || "",
          reminderFired: e["custom-calendar-reminder-fired"] || "false",
          reminderFiredAt: e["custom-calendar-reminder-fired-at"] || "",
        });
      }
      try {
        const o = await this.loadHorizontalTableEvents(t, e),
          r = new Set(a.map((t) => t.id));
        for (const t of o)
          this.recentlyDeletedEventIds.has(t.id) || r.has(t.id) || a.push(t);
      } catch (t) {
        console.warn("load horizontal event tables failed", t);
      }
      if (loadToken !== this.loadEventsToken) return;
      this.events = a;
    }
    renderMiniMonth() {
      const t = this.rootElement?.querySelector(".stbc-mini-month");
      if (!t) return;
      const e = b(
          new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            1,
          ),
        ),
        n = p(new Date());
      ((t.innerHTML = Array.from({ length: 42 }, (t, s) => {
        const a = m(e, s);
        return `<button class="stbc-mini-cell ${p(a) === n ? "is-current" : ""}" data-date="${p(a)}">${a.getDate()}</button>`;
      }).join("")),
        t.querySelectorAll("[data-date]").forEach((t) => {
          t.addEventListener("click", () => {
            ((this.currentDate = new Date(`${t.dataset.date}T12:00:00`)),
              (this.viewMode = "week"),
              this.render());
          });
        }));
    }
    renderWeek() {
      const t = this.rootElement?.querySelector(".stbc-main");
      if (!t) return;
      const e = b(this.currentDate),
        n = Array.from({ length: 7 }, (t, n) => m(e, n)),
        s = this.config.dayEndHour - this.config.dayStartHour,
        a = 56 * s;
      ((t.innerHTML = `\n      <div class="stbc-week" style="--stbc-hours:${s}">\n        <div class="stbc-week-header-grid">\n          <div class="stbc-timezone">GMT+8</div>\n          ${n.map((t) => `<div class="stbc-day-head ${p(t) === p(new Date()) ? "is-today" : ""}">周${"日一二三四五六"[t.getDay()]} ${t.getDate()}</div>`).join("")}\n        </div>\n        <div class="stbc-week-body">\n          <div class="stbc-time-gutter">\n            ${Array.from({ length: s }, (t, e) => `<div class="stbc-hour-label">${v(this.config.dayStartHour + e)}:00</div>`).join("")}\n          </div>\n          ${n.map((t) => `<div class="stbc-day-column" data-date="${p(t)}"><div class="stbc-day-column-inner" style="height:${a}px"></div></div>`).join("")}\n        </div>\n      </div>\n    `),
        t
          .querySelectorAll(".stbc-day-column")
          .forEach((t) => this.bindColumn(t)),
        this.placeNowLine());
      const i = this.computeEventLanes(this.events);
      for (const t of this.events) this.placeWeekEvent(t, i.get(t.id) || 0);
    }
    computeEventLanes(t) {
      const e = new Map(),
        n = new Map();
      for (const e of t) {
        const t = p(e.start);
        n.set(t, [...(n.get(t) || []), e]);
      }
      for (const t of n.values()) {
        const n = [];
        for (const s of t.sort(
          (t, e) => t.start.getTime() - e.start.getTime(),
        )) {
          for (let t = n.length - 1; t >= 0; t--)
            n[t].end <= s.start && n.splice(t, 1);
          const t = new Set(n.map((t) => e.get(t.id) || 0));
          let a = 0;
          for (; t.has(a); ) a++;
          (e.set(s.id, a), n.push(s));
        }
      }
      return e;
    }
    computeEventLayouts(t) {
      const e = new Map(),
        n = new Map();
      for (const e of t) {
        const t = p(e.start);
        n.set(t, [...(n.get(t) || []), e]);
      }
      const s = (t) => {
        if (0 === t.length) return;
        const n = [];
        let s = 0;
        for (const a of t.sort(
          (t, e) =>
            t.start.getTime() - e.start.getTime() ||
            t.end.getTime() - e.end.getTime(),
        )) {
          for (let t = n.length - 1; t >= 0; t--)
            n[t].end <= a.start && n.splice(t, 1);
          const t = new Set(n.map((t) => e.get(t.id)?.lane || 0));
          let i = 0;
          for (; t.has(i); ) i++;
          ((s = Math.max(s, i)),
            e.set(a.id, { lane: i, laneCount: 1 }),
            n.push(a));
        }
        const a = s + 1;
        for (const n of t) {
          const t = e.get(n.id);
          t && (t.laneCount = a);
        }
      };
      for (const t of n.values()) {
        const e = [...t].sort((t, e) => t.start.getTime() - e.start.getTime());
        let n = [],
          a = 0;
        for (const t of e)
          (n.length > 0 && t.start.getTime() >= a && (s(n), (n = [])),
            n.push(t),
            (a = Math.max(a, t.end.getTime())));
        s(n);
      }
      return e;
    }
    placeNowLine() {
      const t = new Date(),
        e = this.rootElement?.querySelector(
          `.stbc-day-column[data-date="${p(t)}"] .stbc-day-column-inner`,
        );
      if (!e) return;
      const n = 60 * (t.getHours() - this.config.dayStartHour) + t.getMinutes();
      if (n < 0 || n > 60 * (this.config.dayEndHour - this.config.dayStartHour))
        return;
      const s = document.createElement("div");
      ((s.className = "stbc-now-line"),
        (s.style.top = n * i + "px"),
        e.appendChild(s));
    }
    placeNowLineV2() {
      const t = new Date(),
        e = this.rootElement?.querySelector(".stbc-week-body"),
        n = this.rootElement?.querySelector(`.stbc-day-column[data-date="${p(t)}"]`),
        s = n?.querySelector(".stbc-day-column-inner"),
        gutter = this.rootElement?.querySelector(".stbc-time-gutter");
      if (!e || !n || !s) return;
      const a = 60 * (this.config.dayEndHour - this.config.dayStartHour),
        o = 60 * (t.getHours() - this.config.dayStartHour) + t.getMinutes() + t.getSeconds() / 60;
      if (o < 0 || o > a) return;
      const metrics = this.getDayColumnMetrics(s),
        c = Math.max(1, gutter?.clientHeight || metrics.rect?.height || s.clientHeight || a * i),
        timelineTop = Number.isFinite(gutter?.offsetTop) ? gutter.offsetTop : n.offsetTop,
        l = timelineTop + (o / a) * c,
        d = document.createElement("div");
      ((d.className = "stbc-now-line stbc-now-line--full"),
        (d.style.top = `${l}px`),
        (d.innerHTML = `<span class="stbc-now-time stbc-now-time--inline">${f(t)}</span><span class="stbc-now-rule"></span>`),
        e.appendChild(d));
      if (gutter) {
        const badge = document.createElement("div");
        badge.className = "stbc-now-time stbc-now-time--gutter";
        // anchor the badge's vertical center to the line's actually rendered
        // position so they stay pixel-aligned regardless of rounding/borders
        const badgeTop = Number.isFinite(d.offsetTop) ? d.offsetTop - timelineTop : (o / a) * c;
        badge.style.top = `${badgeTop}px`;
        badge.textContent = f(t);
        gutter.appendChild(badge);
      }
    }
    queueNowLineUpdate() {
      this.rootElement?.querySelectorAll(".stbc-now-line, .stbc-now-time--gutter").forEach((t) => t.remove());
      if (this.rootElement && this._nowLineResizeObsTarget !== this.rootElement) {
        this._nowLineResizeObs?.disconnect();
        this._nowLineResizeObs = new ResizeObserver(() => this.queueNowLineUpdate());
        this._nowLineResizeObs.observe(this.rootElement);
        this._nowLineResizeObsTarget = this.rootElement;
      }
      const t = () => this.updateNowLine();
      ("function" == typeof window.requestAnimationFrame
        ? window.requestAnimationFrame(() => window.requestAnimationFrame(t))
        : window.setTimeout(t, 0),
        window.setTimeout(t, 120),
        window.setTimeout(t, 360));
    }
    updateNowLine() {
      this.rootElement?.querySelectorAll(".stbc-now-line, .stbc-now-time--gutter").forEach((t) => t.remove());
      this.placeNowLineV2();
    }
    startNowLineTimer() {
      this.stopNowLineTimer();
      const t = () => this.queueNowLineUpdate();
      (this.queueNowLineUpdate(),
        (this.nowLineTimer = window.setInterval(t, 15000)),
        (this.nowLineWakeHandler = () => this.queueNowLineUpdate()),
        window.addEventListener("focus", this.nowLineWakeHandler),
        window.addEventListener("resize", this.nowLineWakeHandler),
        document.addEventListener("visibilitychange", this.nowLineWakeHandler));
    }
    stopNowLineTimer() {
      (this.nowLineTimer && window.clearInterval(this.nowLineTimer),
        (this.nowLineTimer = void 0),
        this.nowLineWakeHandler &&
          (window.removeEventListener("focus", this.nowLineWakeHandler),
          window.removeEventListener("resize", this.nowLineWakeHandler),
          document.removeEventListener("visibilitychange", this.nowLineWakeHandler),
          (this.nowLineWakeHandler = void 0)),
        this._nowLineResizeObs?.disconnect(),
        (this._nowLineResizeObs = void 0),
        (this._nowLineResizeObsTarget = void 0));
    }
    bindColumn(t) {
      let e,
        n = 0,
        s = 0,
        a = !1,
        o = !1;
      const r = t.querySelector(".stbc-day-column-inner"),
        c = t.dataset.date || p(new Date()),
        l = (t) => {
          const e = (t - r.getBoundingClientRect().top) / i,
            n =
              Math.round(e / this.config.slotMinutes) * this.config.slotMinutes;
          return Math.max(
            0,
            Math.min(
              n,
              60 * (this.config.dayEndHour - this.config.dayStartHour),
            ),
          );
        },
        d = () => {
          (e?.remove(), (e = void 0), (a = !1));
        };
      (r.addEventListener("pointerdown", (t) => {
        t.target.closest(".stbc-event") ||
          (t.preventDefault(),
          r.setPointerCapture(t.pointerId),
          (a = !0),
          (o = !1),
          (s = t.clientY),
          (n = l(t.clientY)));
      }),
        r.addEventListener("pointermove", (t) => {
          if (!a) return;
          if (!o && Math.abs(t.clientY - s) < 10) return;
          (e ||
            ((e = document.createElement("div")),
            (e.className = "stbc-selection"),
            r.appendChild(e)),
            (o = !0));
          const c = l(t.clientY),
            d = Math.min(n, c),
            u = Math.max(this.config.slotMinutes, Math.abs(c - n));
          ((e.style.top = d * i + "px"), (e.style.height = u * i + "px"));
        }),
        r.addEventListener("pointerup", async (t) => {
          if (!a) return;
          t.preventDefault();
          const e = l(t.clientY);
          if (
            !o ||
            Math.abs(t.clientY - s) < 10 ||
            Math.abs(e - n) < this.config.slotMinutes
          )
            return void d();
          const i = Math.min(n, e),
            r = Math.max(i + this.config.slotMinutes, Math.max(n, e));
          (d(), await this.openCreateEventDialogV2(c, i, r));
        }),
        r.addEventListener("pointercancel", () => {
          d();
        }));
    }
    async openCreateEventDialog(t, e, s) {
      const a = this.minutesToDate(t, e),
        i = this.minutesToDate(t, s),
        o = new n.Dialog({
          title: "新建时间块",
          content: `\n        <div class="stbc-form">\n          <label class="stbc-form-row">\n            <span>标题</span>\n            <input class="b3-text-field stbc-form-title" value="新时间块" />\n          </label>\n          <label class="stbc-form-row">\n            <span>开始</span>\n            <input class="b3-text-field stbc-form-start" type="time" value="${f(a)}" />\n          </label>\n          <label class="stbc-form-row">\n            <span>结束</span>\n            <input class="b3-text-field stbc-form-end" type="time" value="${f(i)}" />\n          </label>\n          <div class="stbc-form-actions">\n            <button class="b3-button b3-button--cancel stbc-form-cancel">取消</button>\n            <button class="b3-button b3-button--text stbc-form-submit">创建</button>\n          </div>\n        </div>\n      `,
          width: "420px",
        }),
        r = o.element,
        c = r.querySelector(".stbc-form-title"),
        l = r.querySelector(".stbc-form-start"),
        d = r.querySelector(".stbc-form-end");
      r?.classList.add("stbc-glass-dialog");
      r?.querySelector(".b3-dialog__close")?.addEventListener("click", (t) => { t.preventDefault(); t.stopPropagation(); o.destroy(); }, { capture: true });
      this.bindCreateDialogDuration(r, l, d);
      (c?.focus(),
        c?.select(),
        r
          .querySelector(".stbc-form-cancel")
          ?.addEventListener("click", () => o.destroy()),
        r
          .querySelector(".stbc-form-submit")
          ?.addEventListener("click", async () => {
            const e = c?.value.trim() || "新时间块",
              s = this.timeInputToMinutes(l?.value || f(a)),
              r = this.timeInputToMinutes(d?.value || f(i));
            if (r <= s)
              return void (0, n.showMessage)("结束时间必须晚于开始时间");
            const u = await this.createEvent(
              t,
              s - 60 * this.config.dayStartHour,
              r - 60 * this.config.dayStartHour,
              e,
            );
            (this.events.push(u),
              o.destroy(),
              "week" === this.viewMode
                ? this.renderWeek()
                : this.renderMonth());
          }));
    }
    timeInputToMinutes(t) {
      const [e, n] = t.split(":").map((t) => Number(t));
      return 60 * e + n;
    }
    placeWeekEvent(t, e = 0) {
      const n = p(t.start),
        s = this.rootElement?.querySelector(
          `.stbc-day-column[data-date="${n}"] .stbc-day-column-inner`,
        );
      if (!s) return;
      const a =
          60 * (t.start.getHours() - this.config.dayStartHour) +
          t.start.getMinutes(),
        o =
          60 * (t.end.getHours() - this.config.dayStartHour) +
          t.end.getMinutes(),
        r = Math.max(0, a) * i,
        c = Math.max(24, (o - a) * i),
        l = document.createElement("div");
      ((l.className = "stbc-event"),
        c < 72 && l.classList.add("is-compact"),
        c < 38 && l.classList.add("is-tiny"),
        c < 30 && l.classList.add("is-micro"),
        (l.title = `${t.title}\n${f(t.start)} - ${f(t.end)}${t.label ? `\n${t.label}` : ""}`),
        (l.draggable = !0),
        l.style.setProperty("--stbc-lane", String(Math.min(e, 3))),
        (l.style.top = `${r}px`),
        (l.style.height = `${c}px`),
        (l.innerHTML = `\n      <div class="stbc-event-title">${y(t.title)}</div>\n      <div class="stbc-event-time">${f(t.start)} - ${f(t.end)}</div>\n      <div class="stbc-event-duration">${y(this.formatEventDurationMinutes((t.end.getTime() - t.start.getTime()) / 6e4))}</div>\n      <div class="stbc-event-resize"></div>\n    `),
        l.addEventListener("dragend", async (e) => {
          const s = document
            .elementFromPoint(e.clientX, e.clientY)
            ?.closest(".stbc-day-column");
          if (!s) return;
          const a = s
              .querySelector(".stbc-day-column-inner")
              .getBoundingClientRect(),
            o = (e.clientY - a.top) / i,
            r =
              Math.round(o / this.config.slotMinutes) * this.config.slotMinutes,
            c = Math.max(
              this.config.slotMinutes,
              (t.end.getTime() - t.start.getTime()) / 6e4,
            );
          (await this.updateEventTime(t.id, s.dataset.date || n, r, r + c),
            await this.render());
        }),
        l
          .querySelector(".stbc-event-resize")
          .addEventListener("mousedown", (e) => {
            e.stopPropagation();
            const a = async (e) => {
                const n = (e.clientY - s.getBoundingClientRect().top) / i,
                  a =
                    Math.round(n / this.config.slotMinutes) *
                    this.config.slotMinutes,
                  o =
                    60 * (t.start.getHours() - this.config.dayStartHour) +
                    t.start.getMinutes();
                l.style.height = `${Math.max(24, (a - o) * i)}px`;
              },
              o = async (e) => {
                (window.removeEventListener("mousemove", a),
                  window.removeEventListener("mouseup", o));
                const r = (e.clientY - s.getBoundingClientRect().top) / i,
                  c =
                    Math.round(r / this.config.slotMinutes) *
                    this.config.slotMinutes,
                  l =
                    60 * (t.start.getHours() - this.config.dayStartHour) +
                    t.start.getMinutes();
                (await this.updateEventTime(
                  t.id,
                  n,
                  l,
                  Math.max(l + this.config.slotMinutes, c),
                ),
                  await this.render());
              };
            (window.addEventListener("mousemove", a),
              window.addEventListener("mouseup", o));
          }),
        s.appendChild(l));
    }
    renderMonth() {
      const t = this.rootElement?.querySelector(".stbc-main");
      if (!t) return;
      const e = b(
        new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          1,
        ),
      );
      ((t.innerHTML = `<div class="stbc-month">${Array.from(
        { length: 42 },
        (t, n) => {
          const s = m(e, n),
            a = p(s),
            i = this.events.filter((t) => p(t.start) === a);
          return `\n        <div class="stbc-month-day ${a === p(new Date()) ? "is-today" : ""}" data-date="${a}">\n          <div class="stbc-month-num">${s.getDate()}</div>\n          ${i.map((t) => `<div class="stbc-month-event" data-id="${t.id}">${t.allDay ? "全天" : f(t.start)} ${y(t.title)}</div>`).join("")}\n        </div>\n      `;
        },
      ).join("")}</div>`),
        t.querySelectorAll(".stbc-month-event").forEach((t) => {
        }),
        t.querySelectorAll(".stbc-month-day").forEach((t) => {
          t.addEventListener("dblclick", async () => {
            const e = window.prompt("安排什么？", "新时间块");
            e &&
              (await this.createEvent(
                t.dataset.date || p(new Date()),
                540 - 60 * this.config.dayStartHour,
                600 - 60 * this.config.dayStartHour,
                e,
              ),
              await this.render());
          });
        }));
    }
    minutesToDate(t, e) {
      const n = new Date(`${t}T00:00:00`);
      return (
        n.setHours(this.config.dayStartHour, 0, 0, 0),
        n.setMinutes(n.getMinutes() + e),
        n
      );
    }
    async createEvent(t, e, s, a, i = c.value, o = "", r = !1, note = "") {
      const l = await this.ensureDailyDoc(t),
        b = this.minutesToDate(t, e),
        v = this.minutesToDate(t, s),
        d = await this.insertEventTableBlockForLabel(l, o, {
          title: a,
          start: b,
          end: v,
          color: i,
          label: o,
          note,
          status: "todo",
          allDay: r,
          reminderEnabled: !1,
          reminderTime: "",
          reminderOffset: "",
          reminderFired: "false",
          reminderFiredAt: "",
        }),
        h = d?.eventId;
      if (!h) throw new Error("创建表格行失败：未返回事件 ID");
      return (
        (0, n.showMessage)("已写入事件表格"),
        {
          id: h,
          recordBlockId: d.tableBlockId,
          rowIndex: d.rowIndex,
          title: a,
          start: b,
          end: v,
          color: i,
          label: o,
          note,
          status: "todo",
          allDay: r,
          reminderEnabled: !1,
          reminderTime: "",
          reminderOffset: "",
          reminderFired: "false",
          reminderFiredAt: "",
        }
      );
    }
    extractInsertedBlockIds(t) {
      const e = [],
        n = (t, s = !1) => {
          if (!t || "object" != typeof t) return;
          if (Array.isArray(t)) return void t.forEach((t) => n(t, s));
          const a = t;
          s && "string" == typeof a.id && a.id && e.push(a.id);
          for (const [t, e] of Object.entries(a))
            n(e, s || "doOperations" === t);
        };
      return (
        n(t),
        0 === e.length &&
          t &&
          "object" == typeof t &&
          "string" == typeof t.id &&
          e.push(t.id),
        Array.from(new Set(e))
      );
    }
    extractDocId(t) {
      return "string" == typeof t ? t : t?.id;
    }
    async updateEventTime(t, e, s, a) {
      const o = this.minutesToDate(e, s),
        r = this.minutesToDate(e, a),
        c = this.events.find((e) => e.id === t) || {};
      if (Number.isNaN(o.getTime()) || Number.isNaN(r.getTime()) || r <= o)
        throw new Error("结束时间必须晚于开始时间");
      if (this.parseTableRowEventId(t)) {
        await this.rewriteEventRecordBlock(t, { ...c, start: o, end: r, allDay: !1 }, { writeAttrs: !0 });
        await this.rebaseReminderForEvent(t, o).catch((e) => {
          console.warn("rebase reminder after time update failed", t, e);
        });
        this.events = this.events.map((e) =>
          e.id === t ? { ...e, start: o, end: r, allDay: !1 } : e,
        );
        (0, n.showMessage)("已更新时间块");
        return;
      }
      const i = await u("/api/attr/getBlockAttrs", { id: t }).catch(() => ({}));
      await this.rewriteEventRecordBlock(
        t,
        {
          title: c.title || i["custom-calendar-title"] || "时间块",
          start: o,
          end: r,
          color: c.color || i["custom-calendar-color"],
          label: c.label ?? i["custom-calendar-label"] ?? "",
          note: c.note ?? i["custom-calendar-note"] ?? "",
          status: c.status || i["custom-calendar-status"],
          allDay: !1,
          reminderEnabled: typeof c.reminderEnabled === "boolean" ? c.reminderEnabled : "true" === i["custom-calendar-reminder-enabled"],
          reminderTime: c.reminderTime ?? i["custom-calendar-reminder-time"] ?? "",
          reminderOffset: c.reminderOffset ?? i["custom-calendar-reminder-offset"] ?? "",
          reminderFired: c.reminderFired ?? i["custom-calendar-reminder-fired"] ?? "false",
          reminderFiredAt: c.reminderFiredAt ?? i["custom-calendar-reminder-fired-at"] ?? "",
        },
        { writeAttrs: !0 },
      );
      await this.rebaseReminderForEvent(t, o).catch((e) => {
        console.warn("rebase reminder after time update failed", t, e);
      });
      this.events = this.events.map((e) =>
        e.id === t ? { ...e, start: o, end: r, allDay: !1 } : e,
      );
      (0, n.showMessage)("已更新时间块");
    }
    async updateEventAllDayDate(t, e, s) {
      const i = this.minutesToDate(e, 60 * -this.config.dayStartHour),
        o = this.minutesToDate(e, 24 * s * 60 - 60 * this.config.dayStartHour);
      if (this.parseTableRowEventId(t)) {
        const e = this.events.find((e) => e.id === t) || {};
        await this.rewriteEventRecordBlock(t, { ...e, start: i, end: o, allDay: !0 }, { writeAttrs: !0 });
        await this.rebaseReminderForEvent(t, i).catch((e) => {
          console.warn("rebase reminder after all-day update failed", t, e);
        });
        (0, n.showMessage)("已更新全天事件");
        return;
      }
      const a = await u("/api/attr/getBlockAttrs", { id: t });
      await this.rewriteEventRecordBlock(
        t,
        {
          title: a["custom-calendar-title"] || "全天事件",
          start: i,
          end: o,
          color: a["custom-calendar-color"],
          label: a["custom-calendar-label"],
          note: a["custom-calendar-note"] || "",
          status: a["custom-calendar-status"],
          allDay: !0,
          reminderEnabled: "true" === a["custom-calendar-reminder-enabled"],
          reminderTime: a["custom-calendar-reminder-time"] || "",
          reminderOffset: a["custom-calendar-reminder-offset"] || "",
          reminderFired: a["custom-calendar-reminder-fired"] || "false",
          reminderFiredAt: a["custom-calendar-reminder-fired-at"] || "",
        },
        { writeAttrs: !0 },
      );
      await this.rebaseReminderForEvent(t, i).catch((e) => {
        console.warn("rebase reminder after all-day update failed", t, e);
      });
      (0, n.showMessage)("已更新全天事件");
    }
    async setEventAttrs(t, e, n, s, a, i, o = "todo", r = !1, d = "") {
      if (this.parseTableRowEventId(t)) return;
      const l = {
        "custom-calendar-start": g(n),
        "custom-calendar-end": g(s),
        "custom-calendar-title": e,
        "custom-calendar-color": a || c.value,
        "custom-calendar-label": i || "",
        "custom-calendar-note": d || "",
        "custom-calendar-status": o,
        "custom-calendar-all-day": r ? "true" : "false",
      };
      await u("/api/attr/setBlockAttrs", { id: t, attrs: l });
    }
    getWeekdayCN(t) {
      return ["日", "一", "二", "三", "四", "五", "六"][t.getDay()] || "";
    }
    formatDateLayout(t, e) {
      const n = {
        yyyy: String(t.getFullYear()),
        YYYY: String(t.getFullYear()),
        yy: v(t.getFullYear() % 100),
        YY: v(t.getFullYear() % 100),
        MM: v(t.getMonth() + 1),
        M: String(t.getMonth() + 1),
        dd: v(t.getDate()),
        DD: v(t.getDate()),
        d: String(t.getDate()),
        D: String(t.getDate()),
        HH: v(t.getHours()),
        H: String(t.getHours()),
        mm: v(t.getMinutes()),
        m: String(t.getMinutes()),
        ss: v(t.getSeconds()),
        s: String(t.getSeconds()),
      };
      return String(e || "")
        .replace(/2006/g, n.yyyy)
        .replace(/06/g, n.yy)
        .replace(/01/g, n.MM)
        .replace(/02/g, n.dd)
        .replace(/15/g, n.HH)
        .replace(/04/g, n.mm)
        .replace(/05/g, n.ss)
        .replace(/yyyy|YYYY|yy|YY|MM|M|dd|DD|d|D|HH|H|mm|m|ss|s/g, (t) => n[t] ?? t);
    }
    formatPathDateTokens(t, e) {
      const n = {
        yyyy: String(t.getFullYear()),
        YYYY: String(t.getFullYear()),
        yy: v(t.getFullYear() % 100),
        YY: v(t.getFullYear() % 100),
        MM: v(t.getMonth() + 1),
        dd: v(t.getDate()),
        DD: v(t.getDate()),
        HH: v(t.getHours()),
        mm: v(t.getMinutes()),
        ss: v(t.getSeconds()),
      };
      return String(e || "").replace(/yyyy|YYYY|yy|YY|MM|dd|DD|HH|mm|ss/g, (t) => n[t] ?? t);
    }
    renderDailyPathTemplate(t, e) {
      const n = String(t || "")
        .replace(/\{\{\s*now\s*\|\s*date\s+["']([^"']+)["']\s*\}\}/gi, (t, n) => this.formatDateLayout(e, n))
        .replace(/\{\{\s*now\s*\|\s*WeekdayCN\s*\}\}/gi, () => this.getWeekdayCN(e))
        .replace(/\{\{\s*now\s*\|\s*weekdayCN\s*\}\}/gi, () => this.getWeekdayCN(e))
        .replace(/\{\{\s*date\s+["']([^"']+)["']\s*\}\}/gi, (t, n) => this.formatDateLayout(e, n))
        .replace(/\{\{\s*WeekdayCN\s*\}\}/gi, () => this.getWeekdayCN(e));
      return this.formatPathDateTokens(e, n);
    }
    normalizeDocHPath(t) {
      const e = String(t || "/daily note")
        .replace(/\\/g, "/")
        .replace(/\/{2,}/g, "/")
        .replace(/\/+$/g, "");
      return e.startsWith("/") ? e || "/daily note" : `/${e}`;
    }
    getDailyDocHPath(t) {
      const e = new Date(`${t}T12:00:00`),
        n = String(this.config.dailyRootHPath || "/daily note").trim() || "/daily note",
        s = /\{\{|\bYYYY\b|\byyyy\b|\bYY\b|\byy\b|\bMM\b|\bDD\b|\bdd\b/.test(n);
      if (s) return this.normalizeDocHPath(this.renderDailyPathTemplate(n, e));
      const [a, i] = t.split("-");
      return this.normalizeDocHPath(`${n}/${a}/${i}/${t}`);
    }
    async listNotebooks() {
      const t = await u("/api/notebook/lsNotebooks", {}).catch(() => null);
      return Array.isArray(t?.notebooks) ? t.notebooks : [];
    }
    async resolveNotebookId() {
      const notebooks = await this.listNotebooks(),
        open = notebooks.filter((nb) => !nb.closed);
      if (!open.length)
        throw new Error(
          notebooks.length
            ? "当前没有已打开的笔记本，请在思源中打开一个笔记本后再创建日程。"
            : "未找到任何笔记本，请先在思源中创建并打开一个笔记本。",
        );
      const current = this.config.notebookId;
      if (current && open.some((nb) => nb.id === current)) return current;
      const picked = open[0];
      ((this.config.notebookId = picked.id),
        await this.saveData(a, this.config).catch(() => {}),
        (0, n.showMessage)(
          `时间块日历：已自动选择笔记本「${picked.name}」用于创建日记文档，可在插件设置中修改。`,
        ));
      return picked.id;
    }
    async populateNotebookSelect(selectEl) {
      const notebooks = await this.listNotebooks(),
        open = notebooks.filter((nb) => !nb.closed);
      selectEl.innerHTML = "";
      if (!open.length) {
        const opt = document.createElement("option");
        ((opt.value = ""), (opt.textContent = "未找到已打开的笔记本"));
        selectEl.appendChild(opt);
        return;
      }
      for (const nb of open) {
        const opt = document.createElement("option");
        ((opt.value = nb.id), (opt.textContent = nb.name));
        selectEl.appendChild(opt);
      }
      const current = this.config.notebookId,
        selected = current && open.some((nb) => nb.id === current) ? current : open[0].id;
      ((selectEl.value = selected), (this.getSettingsDraftConfig().notebookId = selected));
    }
    async ensureDailyDoc(t) {
      const e = this.getDailyDocHPath(t),
        n = await this.findDocByHPath(e);
      if (n) return n;
      const notebookId = await this.resolveNotebookId(),
        s = `${e}.sy`,
        a = await u("/api/filetree/createDocWithMd", {
          notebook: notebookId,
          path: s,
          markdown: `# ${t}\n\n`,
        }).catch(async () => {
          const n = await this.findDocByHPath(e);
          if (n) return n;
          throw new Error(`无法创建日记文档：${e}`);
        }),
        i = this.extractDocId(a);
      if (!i) {
        const n = await this.findDocByHPath(e);
        if (n) return n;
        throw new Error(`无法创建日记文档：${e}`);
      }
      return i;
    }
    async findDocByHPath(t) {
      const e = t.replace(/'/g, "''"),
        n = await u("/api/query/sql", {
          stmt: `SELECT id FROM blocks WHERE type = 'd' AND hpath = '${e}' LIMIT 1`,
        }).catch(() => []);
      return n?.[0]?.id;
    }
  }
  module.exports = e;
})();
