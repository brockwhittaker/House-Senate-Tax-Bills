(async () => {
    window.vue = new Vue({
        el: "#app",
        data: store,
        methods,
    });

    $("option[value='CA']").prop("selected", true);

    vue.$refs.incomeRange.dispatchEvent(new CustomEvent('input', {}));
})();
