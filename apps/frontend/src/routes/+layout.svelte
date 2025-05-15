<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import { authLoading, initAuth } from "$lib/auth-client";

  let { children } = $props();

  onMount(() => {
    initAuth();
  });
</script>

{#if $authLoading}
  <p>Chargement...</p>
{:else}
  {@render children()}
{/if}
