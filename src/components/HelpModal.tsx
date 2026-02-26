import '../styles/HelpModal.css';

export function HelpModal() {
  return (
    <div className="help-modal">
      <p>Guess the <strong>WORDLE</strong> in 6 tries.</p>
      
      <p>Each guess must be a valid 5-letter word. Hit the enter button to submit.</p>
      
      <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
      
      <div className="examples">
        <p><strong>Examples</strong></p>
        
        <div className="example">
          <div className="example-tiles">
            <div className="example-tile correct">W</div>
            <div className="example-tile">E</div>
            <div className="example-tile">A</div>
            <div className="example-tile">R</div>
            <div className="example-tile">Y</div>
          </div>
          <p><strong>W</strong> is in the word and in the correct spot.</p>
        </div>
        
        <div className="example">
          <div className="example-tiles">
            <div className="example-tile">P</div>
            <div className="example-tile present">I</div>
            <div className="example-tile">L</div>
            <div className="example-tile">L</div>
            <div className="example-tile">S</div>
          </div>
          <p><strong>I</strong> is in the word but in the wrong spot.</p>
        </div>
        
        <div className="example">
          <div className="example-tiles">
            <div className="example-tile">V</div>
            <div className="example-tile">A</div>
            <div className="example-tile">G</div>
            <div className="example-tile absent">U</div>
            <div className="example-tile">E</div>
          </div>
          <p><strong>U</strong> is not in the word in any spot.</p>
        </div>
      </div>
    </div>
  );
}