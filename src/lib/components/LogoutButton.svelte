<script lang="ts">
  import { invalidateAll } from "$app/navigation";
</script>

<form
  on:submit|preventDefault={async () => {
    const res = await fetch("/api/auth/logout", {
      method: "post",
      headers: {
        accept: "application/json",
      },
    });
    if (res.ok) {
      invalidateAll();
    }
  }}
>
  <button type="submit">Logout</button>
</form>
