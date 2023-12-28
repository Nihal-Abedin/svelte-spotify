<script lang="ts" context="module">
  let currentAudio: HTMLAudioElement;
</script>

<script lang="ts">
  import { Pause, Play } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  type TrackType =
    | SpotifyApi.TrackObjectFull
    | SpotifyApi.TrackObjectSimplified;
  export let track: TrackType;

  const dispatch = createEventDispatcher<{
    play: { track: TrackType };
    pause: { track: TrackType };
  }>();
  let audio: HTMLAudioElement;
  let paused = true;

  const onPlay = () => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.currentTime = 0;
      currentAudio.pause();
    }
    currentAudio = audio;
    dispatch("play", { track });
  };
  const onPause = () => {
    dispatch("pause", { track });

  };
</script>

<div class="player">
  <audio
    on:play={onPlay}
    on:pause={onPause}
    bind:this={audio}
    bind:paused
    controls
    src={track.preview_url}
    preload="none"
  />
  <button
    aria-label={paused ? `Play ${track.name}` : `Pause ${track.name}`}
    on:click={() => {
      if (paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }}
  >
    {#if paused}
      <Play color="var(--text-color)" focusable="false" aria-hidden />
    {:else}
      <Pause color="var(--text-color)" focusable="false" aria-hidden />
    {/if}
  </button>
</div>

<style lang="scss">
  .player {
    audio {
      display: none;
    }
    button {
      width: 12px;
      height: 12px;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      :global(svg) {
        fill: var(--text-color);
        width: 12px;
        height: 12px;
      }
    }
  }
</style>
