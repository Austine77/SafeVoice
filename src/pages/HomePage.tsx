import { ScreenId } from '../data';

type Props = { goTo: (screen: ScreenId) => void };

export default function HomePage({ goTo }: Props) {
  return (
    <div className="grid grid-2">
      <div className="card hero">
        <h3>You are safe here.</h3>
        <p>Report abuse anonymously, get support quickly, and track your case with calm, clear steps.</p>
        <div className="cta-grid">
          <button className="cta-card" onClick={() => goTo('report1')}><strong>Report Abuse</strong><span>Start the secure 5-step reporting flow.</span></button>
          <button className="cta-card" onClick={() => goTo('emergency')}><strong>Emergency Help</strong><span>Access urgent support actions fast.</span></button>
          <button className="cta-card" onClick={() => goTo('tracking')}><strong>Track Case</strong><span>Enter your case ID and monitor progress privately.</span></button>
          <button className="cta-card" onClick={() => goTo('support')}><strong>Find Support</strong><span>See shelters, hospitals, and legal aid options.</span></button>
          <button className="cta-card" onClick={() => goTo('resources')}><strong>Learn Your Rights</strong><span>Simple articles and safety guidance.</span></button>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><b>Anonymous</b><span>Identity hidden by default unless the user chooses to share contact details.</span></div>
        <div className="stat"><b>Quick Exit</b><span>Visible across the experience for safe disengagement.</span></div>
        <div className="stat"><b>Track Case</b><span>Unique case ID allows progress updates without exposing the survivor.</span></div>
      </div>
    </div>
  );
}
