
export default ({ html }) => html`
  <div class="modal is-active">
    <div class="p-close modal-background"></div>
    <div class="modal-content">
      <div class="box">
          <div class="field">
              <label class="label">Name</label>
              <div class="control">
                  <input class="input" type="text" placeholder="Text input">
              </div>
          </div>
      </div>
    </div>
    <button class="p-close modal-close is-large" aria-label="close"></button>
  </div>
`;
