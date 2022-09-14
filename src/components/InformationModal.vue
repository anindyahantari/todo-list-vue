<template>
    <b-modal data-cy="modal-information" id="modal-information" hide-header hide-footer centered>
        <img data-cy="modal-information-icon" src="../assets/modal-information-icon.png" width="24" height="24" />
        <span data-cy="modal-information-title"> Activity berhasil dihapus</span>
    </b-modal>
</template>

<script>
export default {
    name: "InformationModal",
}
</script>

<style scoped>

[data-cy="modal-information-title"]  {
    color: #111111;
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    margin-left: 24px;
}
</style>