import { ScreenId } from '../data';

type EmergencyProps = { goTo: (screen: ScreenId) => void };

export function ChatPage() {
  return (
    <section className="card">
      <h3>Secure Chat</h3>
      <div className="chat-box form-gap">
        <div className="msg sw">Hello. You are speaking with a support officer. You can stay anonymous here.</div>
        <div className="msg you">I need help but I do not want anyone around me to know.</div>
        <div className="msg sw">That is okay. We can take this one step at a time and only share what feels safe.</div>
      </div>
      <div className="form-gap"><input placeholder="Type a message..." /></div>
    </section>
  );
}

export function EmergencyPage({ goTo }: EmergencyProps) {
  return (
    <section className="card hero">
      <span className="badge alert">Immediate support</span>
      <h3 className="section-title">Are you in immediate danger?</h3>
      <p>Use these urgent options only when it is safe to do so.</p>
      <div className="support-grid form-gap">
        <div className="support-card"><strong>Call Emergency Line</strong><p>Fast action for urgent physical danger.</p><div className="button-row"><button className="btn btn-danger">Call now</button></div></div>
        <div className="support-card"><strong>Alert Nearby Support</strong><p>Notify trusted or assigned support staff.</p><div className="button-row"><button className="btn btn-primary">Send alert</button></div></div>
        <div className="support-card"><strong>Find Safe Shelter</strong><p>View the nearest shelter or safe place.</p><div className="button-row"><button className="btn btn-teal" onClick={() => goTo('support')}>Open support map</button></div></div>
      </div>
    </section>
  );
}

export function SupportMapPage() {
  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>Find Support Near You</h3>
        <div className="map">
          <span className="map-pin pin-one"></span>
          <span className="map-pin pin-two"></span>
          <span className="map-pin pin-three"></span>
          <span className="map-pin pin-four"></span>
        </div>
        <div className="chips">
          <span className="chip">Hospitals</span>
          <span className="chip">Legal Aid</span>
          <span className="chip">Support Officers</span>
          <span className="chip">Safe Shelters</span>
        </div>
      </div>
      <div className="card">
        <h3>Nearby support options</h3>
        <div className="support-grid single-column form-gap">
          <div className="support-card"><strong>Hope Shelter Centre</strong><p>Safe shelter · 1.4 km away</p></div>
          <div className="support-card"><strong>City Women’s Legal Aid</strong><p>Legal assistance · 2.1 km away</p></div>
          <div className="support-card"><strong>Community Support Desk</strong><p>Confidential support · 900 m away</p></div>
        </div>
      </div>
    </div>
  );
}

export function ResourcesPage() {
  return (
    <section className="card">
      <h3>Resource Library</h3>
      <p>Simple, supportive content designed for users who may be distressed or accessing the app on limited data.</p>
      <div className="form-gap"><input placeholder="Search resources..." /></div>
      <div className="chips">
        <span className="chip">After abuse</span>
        <span className="chip">Legal rights</span>
        <span className="chip">Safe help-seeking</span>
        <span className="chip">Mental health support</span>
      </div>
      <div className="resource-grid form-gap">
        <div className="resource-item"><strong>What to do after abuse</strong><p>Immediate safety steps and how to preserve evidence if safe.</p></div>
        <div className="resource-item"><strong>Legal rights for survivors</strong><p>Clear rights information using simple language.</p></div>
        <div className="resource-item"><strong>How to seek help safely</strong><p>Discreet ways to contact services or trusted adults.</p></div>
        <div className="resource-item"><strong>Mental health support</strong><p>Calming guidance and referral options for emotional recovery.</p></div>
      </div>
    </section>
  );
}
