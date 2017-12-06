(async () => {
    $("body").on("click", ".toggle .option", function () {
        var $parent = $(this).parent();
        $parent.children(".option").removeClass("active");
        $(this).addClass("active");

        $parent.trigger({ type: "change", value: $(this).data("value") });
    });

    $("body").on("change", ".toggle", function (e) {
        const setValue = $(this).data("set-value");

        store[setValue] = e.value;
        methods.onIncomeUpdate.call(vue);
    });

    window.vue = new Vue({
        el: "#app",
        data: store,
        methods,
    });

    $("option[value='CA']").prop("selected", true);

    vue.$refs.incomeRange.dispatchEvent(new CustomEvent('input', {}));
})();
