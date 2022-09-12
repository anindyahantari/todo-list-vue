<template>
    <div>
        <b-navbar data-cy="header-background" toggleable="md" type="dark">
            <b-container>
                <b-navbar-brand data-cy="header-title" href="/">TO DO LIST APP</b-navbar-brand>                 
            </b-container>
        </b-navbar>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>

.navbar {
    background: #16ABF8;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding: 33px 0 26px;
}

.navbar-brand {
    font-weight: 700;
    font-size: 24px;
    line-height: 36px;
}

</style>