<script lang="ts">
  import { page } from "$app/stores";
  import logo from "$assests/Spotify_Logo_RGB_White.png";
  import { Home, Search, ListMusic, Menu, X } from "lucide-svelte";
  import type { ComponentType } from "svelte";
  import { fade } from "svelte/transition";
  import IconButton from "./IconButton.svelte";

  export let desktop: boolean;

  let isMobileMenuOpen = false;
  $: isOpen = desktop || isMobileMenuOpen;

  const menuItems: { path: string; label: string; icon: ComponentType }[] = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/search",
      label: "Search",
      icon: Search,
    },
    {
      path: "/playlists",
      label: "Playlists",
      icon: ListMusic,
    },
  ];

  const openMenu = () => {
    isMobileMenuOpen = true;
  };
  const closeMenu = () => {
    isMobileMenuOpen = false;
  };
</script>

<svelte:head>
  {#if isMobileMenuOpen && !desktop}
    <style>
      body {
        overflow: hidden;
      }
    </style>
  {/if}
</svelte:head>

<div class="nav-content" class:desktop class:mobile={!desktop}>
  {#if !desktop && isMobileMenuOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="overlay"
      on:click={closeMenu}
      transition:fade={{ duration: 200 }}
    />
  {/if}
  <nav aria-label="Main">
    {#if !desktop}
      <IconButton icon={Menu} on:click={openMenu} label="open-menu" class="menu-button"/>
    {/if}
    <div class="nav-content-inner" class:is-hidden={!isOpen}>
      {#if !desktop}
        <IconButton
          icon={X}
          on:click={closeMenu}
          label="open-menu"
          class="close-menu-button"
        />
      {/if}
      <img src={logo} class="logo" alt="logo" />
      <ul>
        {#each menuItems as item}
          <li class:active={item.path === $page.url.pathname}>
            <a href={item.path}>
              <svelte:component
                this={item.icon}
                focusable="false"
                aria-hidden="true"
                color="var(--text-color)"
                size={26}
              />
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
</div>

<style lang="scss">
  .nav-content {
    .overlay {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: var(--sidebar-color);
      opacity: 0.75;
      z-index: 100;
      @include breakpoint.up("md") {
        display: none;
      }
    }
    .logo {
      max-width: 100%;
      width: 130px;
    }
    .nav-content-inner {
      padding: 20px;
      min-width: var(--sidebar-width);
      background-color: var(--sidebar-color);
      height: 100vh;
      overflow: auto;
      display: none;
      ul {
        padding: 0;
        margin: 20px 0 0;
        list-style: none;
        li {
          &.active {
            a {
              opacity: 1;
            }
          }
          a {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--text-color);
            font-size: functions.toRem(14);
            font-weight: 500;
            padding: 5px;
            margin: 10px 0;
            opacity: 0.7;
            transition: opacity 0.2s;
            &:hover,
            &:focus {
              opacity: 1;
            }
            :global(svg) {
              margin-right: 12px;
            }
          }
        }
      }
    }
    &.desktop {
      position: sticky;
      top: 0;
      .nav-content-inner {
        @include breakpoint.up("md") {
          display: block;
        }
      }
    }
    &.mobile .nav-content-inner {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      transition: transform 200ms, opacity 200ms;
      &.is-hidden {
        transform: translateX(-100%);
        opacity: 0;
      }
      @include breakpoint.down("md") {
        display: block;
      }
    }
    :global(.menu-button) {
      @include breakpoint.up("md") {
        display: none;
      }
    }
    :global(.close-menu-button) {
      position: absolute;
      right: 20px;
    }
  }
</style>
