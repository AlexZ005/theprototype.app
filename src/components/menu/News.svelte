<script>
    import { Accordion, AccordionItem, Modal, Button, Checkbox } from 'flowbite-svelte';
    export let showModal = false;
    export let onClose;


    import { onMount } from 'svelte';

    onMount(() => {
        // Check if the user has already seen the modal
        if (typeof localStorage !== 'undefined' && !localStorage.getItem('hasSeenModal')) {
            showModal = false;
        }
    });

    function closeModal() {
    showModal = false;
    localStorage.setItem('hasSeenModal', 'true');
    }
  </script>

  {#if showModal}
<Modal
  title=""
  autoclose
  outsideclose
  bind:open={showModal}
  dismissable={false}>
        <span class="close" on:click={closeModal}>&times;</span>
        <br />
        <br />
        <br />
</Modal>
  {/if}
  
  <style>

    .video-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    .modal {
      display: block;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  </style>