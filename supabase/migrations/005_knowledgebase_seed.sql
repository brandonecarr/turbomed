-- Knowledgebase Seed Data
-- Run this after 004_knowledgebase.sql to populate initial content
-- Content sourced from turbomedorthotics.com and turbomedusa.com

-- ============================================================
-- CATEGORIES
-- ============================================================

INSERT INTO kb_categories (id, name, slug, description, icon, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Products', 'products', 'Learn about the XTERN product line including CLASSIC+, FRONTIER, SUMMIT, and Pediatric AFOs.', 'Package', 1),
  ('a0000000-0000-0000-0000-000000000002', 'Fitting & Sizing', 'fitting-sizing', 'Guides on sizing, fitting, shoe compatibility, and getting the most out of your XTERN.', 'Ruler', 2),
  ('a0000000-0000-0000-0000-000000000003', 'Conditions & Treatment', 'conditions-treatment', 'Information about foot drop, its causes, and how the XTERN helps manage it.', 'HeartPulse', 3),
  ('a0000000-0000-0000-0000-000000000004', 'Insurance & Pricing', 'insurance-pricing', 'Pricing details, insurance coverage, Medicare/Medicaid, and reimbursement information.', 'DollarSign', 4),
  ('a0000000-0000-0000-0000-000000000005', 'Getting Started', 'getting-started', 'How to get your XTERN foot drop brace — from assessment to fitting.', 'Rocket', 5),
  ('a0000000-0000-0000-0000-000000000006', 'Parts & Accessories', 'parts-accessories', 'Replacement parts, accessories, and maintenance for your XTERN AFO.', 'Wrench', 6),
  ('a0000000-0000-0000-0000-000000000007', 'About Turbomed', 'about-turbomed', 'Company history, mission, and global distribution network.', 'Building2', 7)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- ARTICLES
-- ============================================================

-- ------- PRODUCT ARTICLES -------

INSERT INTO kb_articles (title, slug, category_id, content_type, content, excerpt, status, tags, meta_title, meta_description, sort_order, published_at) VALUES

-- 1. XTERN CLASSIC+
(
  'XTERN CLASSIC+ — External Ankle Foot Orthosis',
  'xtern-classic-plus',
  'a0000000-0000-0000-0000-000000000001',
  'product_doc',
  '<h2>Overview</h2>
<p>The <strong>XTERN CLASSIC+</strong> is Turbomed''s flagship fully dynamic foot drop orthosis. Enhanced with the latest <strong>MonoCore technology</strong>, it provides an exceptionally sleek, discreet design with improved lightweight construction and a lower profile better suited for everyday shoes.</p>
<p>Its unique <strong>Exoskeleton Spring</strong> design is fully flexible and dynamic, providing total foot dorsiflexion assistance without restricting easy plantar flexion. This preserves maximal ankle range of motion and helps maintain calf muscle strength.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>External Design</strong> — Affixed totally outside the shoe to maximize comfort and prevent skin breakdown. No contact with the foot or ankle.</li>
  <li><strong>MonoCore Technology</strong> — Latest generation construction offering improved lightweight and lower profile.</li>
  <li><strong>Universal Shoe Compatibility</strong> — Fits on any laced shoes, hiking footwear, winter boots, or safety boots. Switch between shoes in seconds.</li>
  <li><strong>Dynamic Dorsiflexion Assist</strong> — Spring-like energy return system that stores energy during plantar flexion and releases it to lift the foot during swing phase.</li>
  <li><strong>Full Ankle Range of Motion</strong> — Unlike rigid AFOs, the XTERN allows natural plantar flexion to preserve calf muscle strength.</li>
  <li><strong>Durable Thermoplastic Construction</strong> — Made from highly durable thermoplastic materials built for daily wear.</li>
</ul>

<h2>What''s Included</h2>
<ul>
  <li>1 XTERN CLASSIC+ AFO unit</li>
  <li>1 complete set of calf pads and straps</li>
  <li>5 lace-clips (shoe connectors)</li>
</ul>

<h2>Specifications</h2>
<table>
  <tr><td><strong>Material</strong></td><td>Highly durable thermoplastic</td></tr>
  <tr><td><strong>Sizes</strong></td><td>Small, Medium, Large</td></tr>
  <tr><td><strong>Shoe Range</strong></td><td>US 2.5 – US 16</td></tr>
  <tr><td><strong>Warranty</strong></td><td>2 years against breakage</td></tr>
  <tr><td><strong>HCPCS Code</strong></td><td>L1951</td></tr>
</table>

<h2>Clinical Indications</h2>
<p>The XTERN CLASSIC+ is indicated for patients with foot drop and dorsiflexion weakness caused by:</p>
<ul>
  <li>Peroneal nerve injury</li>
  <li>Stroke (CVA)</li>
  <li>Multiple Sclerosis (MS)</li>
  <li>Charcot-Marie-Tooth disease (CMT)</li>
  <li>Cerebral Palsy (CP)</li>
  <li>Guillain-Barré Syndrome</li>
  <li>Spinal cord injury</li>
  <li>Lumbar radiculopathy</li>
</ul>',
  'The XTERN CLASSIC+ is Turbomed''s flagship fully dynamic foot drop orthosis featuring MonoCore technology, an Exoskeleton Spring design, and universal shoe compatibility.',
  'published',
  ARRAY['product', 'XTERN', 'CLASSIC+', 'AFO', 'foot drop'],
  'XTERN CLASSIC+ External AFO | Turbomed Orthotics',
  'Learn about the XTERN CLASSIC+ — Turbomed''s flagship external ankle foot orthosis with MonoCore technology for foot drop management.',
  1,
  NOW()
),

-- 2. XTERN FRONTIER
(
  'XTERN FRONTIER — AFO Designed for Stroke Patients',
  'xtern-frontier',
  'a0000000-0000-0000-0000-000000000001',
  'product_doc',
  '<h2>Overview</h2>
<p>The <strong>XTERN FRONTIER</strong> is designed especially for foot drop patients with reduced hand dexterity — such as stroke survivors — while remaining suitable for anyone affected by foot drop.</p>
<p>Its innovative <strong>magnetic buckle system</strong> and frontal leg support approach make it the easiest XTERN model to put on and take off, even with one hand.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>One-Handed Operation</strong> — The leg support attachment features a magnetic buckle system that can be attached with one hand, ideal for stroke patients with hemiparesis.</li>
  <li><strong>Frontal Approach</strong> — The frontal approach of the leg support leaves the back of the shoe opening fully accessible for easy donning.</li>
  <li><strong>External Design</strong> — Like all XTERN models, it is affixed totally outside the shoe to maximize comfort and prevent skin breakdown.</li>
  <li><strong>Dynamic Exoskeleton Spring</strong> — Fully flexible and dynamic design allowing walking, running, and hiking without discomfort.</li>
  <li><strong>Universal Shoe Compatibility</strong> — Fits on any shoes, hiking footwear, winter or safety boots. Switch shoes in seconds.</li>
</ul>

<h2>Who Is the FRONTIER For?</h2>
<p>The XTERN FRONTIER was specifically designed for patients who have:</p>
<ul>
  <li>Reduced hand dexterity (e.g., from stroke)</li>
  <li>Hemiparesis affecting one side of the body</li>
  <li>Difficulty bending down to attach traditional AFOs</li>
  <li>Any foot drop condition requiring an easy-to-don orthosis</li>
</ul>

<h2>Specifications</h2>
<table>
  <tr><td><strong>Material</strong></td><td>Durable thermoplastic</td></tr>
  <tr><td><strong>Sizes</strong></td><td>Small, Medium, Large</td></tr>
  <tr><td><strong>Attachment</strong></td><td>Magnetic buckle system</td></tr>
  <tr><td><strong>Warranty</strong></td><td>2 years against breakage</td></tr>
  <tr><td><strong>HCPCS Code</strong></td><td>L1932</td></tr>
</table>',
  'The XTERN FRONTIER is designed for foot drop patients with reduced hand dexterity, featuring a one-handed magnetic buckle system and frontal approach for easy donning.',
  'published',
  ARRAY['product', 'XTERN', 'FRONTIER', 'AFO', 'stroke', 'foot drop'],
  'XTERN FRONTIER AFO for Stroke Patients | Turbomed Orthotics',
  'The XTERN FRONTIER AFO features magnetic buckle attachment for one-handed operation, designed for stroke patients with reduced dexterity.',
  2,
  NOW()
),

-- 3. XTERN SUMMIT
(
  'XTERN SUMMIT — Lightweight Low-Profile AFO',
  'xtern-summit',
  'a0000000-0000-0000-0000-000000000001',
  'product_doc',
  '<h2>Overview</h2>
<p>The <strong>XTERN SUMMIT</strong> is Turbomed''s latest generation drop foot orthosis, based on the same unique external function as the XTERN CLASSIC but with a <strong>more low-profile and slim design</strong>. It is 25% lighter than the XTERN CLASSIC and provides 18% more dorsal lift.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>25% Lighter</strong> — At only 275g, the SUMMIT is significantly lighter than the CLASSIC model.</li>
  <li><strong>18% More Dorsal Lift</strong> — Enhanced spring mechanism provides greater dorsiflexion assistance.</li>
  <li><strong>Low Profile Design</strong> — Slimmer construction sits closer to the shoe for a more discreet appearance.</li>
  <li><strong>Pre-Tensioned Spring</strong> — Comes pre-tensioned to provide active dorsal lift that suits most patients, with adjustability as needed.</li>
  <li><strong>External Shoe Attachment</strong> — Clips attach to lace eyelets; the orthosis can be moved between shoes easily.</li>
</ul>

<h2>What''s Included</h2>
<ul>
  <li>1 XTERN SUMMIT AFO unit</li>
  <li>2 complete sets of calf pads and straps</li>
  <li>10 lace clips</li>
</ul>

<h2>Specifications</h2>
<table>
  <tr><td><strong>Weight</strong></td><td>275g</td></tr>
  <tr><td><strong>Material</strong></td><td>Thermoplastic elastomer and nylon</td></tr>
  <tr><td><strong>Sizes</strong></td><td>Small, Medium, Large</td></tr>
  <tr><td><strong>Shoe Range</strong></td><td>US 2.5 – US 16</td></tr>
  <tr><td><strong>Warranty</strong></td><td>2 years against breakage</td></tr>
  <tr><td><strong>HCPCS Code</strong></td><td>L1951</td></tr>
</table>',
  'The XTERN SUMMIT is 25% lighter than the CLASSIC and provides 18% more dorsal lift with a low-profile, slim design weighing only 275g.',
  'published',
  ARRAY['product', 'XTERN', 'SUMMIT', 'AFO', 'lightweight', 'foot drop'],
  'XTERN SUMMIT Lightweight AFO | Turbomed Orthotics',
  'The XTERN SUMMIT is 25% lighter and provides 18% more dorsal lift than the CLASSIC, with a slim low-profile design at only 275g.',
  3,
  NOW()
),

-- 4. XTERN PEDIATRIC
(
  'XTERN Pediatric — AFO for Children with Foot Drop',
  'xtern-pediatric',
  'a0000000-0000-0000-0000-000000000001',
  'product_doc',
  '<h2>Overview</h2>
<p>The <strong>XTERN Pediatric AFO</strong> is designed specifically for children ages 3–8 living with foot drop. Like all XTERN models, it attaches to the outside of the shoe — removing the need for the brace to fit inside — so kids can wear any footwear they want, including sneakers, boots, and even soccer cleats.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>Designed for Growing Kids</strong> — The pediatric version can be extended and adjusted as the child grows, ensuring maximum lifespan of the brace.</li>
  <li><strong>External Attachment</strong> — Attaches to the front of the shoe, removing the need for the brace to fit inside. Kids can wear normal shoes, football boots, and more.</li>
  <li><strong>Comfortable and Flexible</strong> — Acts as an exoskeleton to the impaired limb, providing unparalleled function without discomfort or rubbing.</li>
  <li><strong>Active Lifestyle Support</strong> — Allows kids to walk and run as long as they want without discomfort.</li>
  <li><strong>Prevents Skin Breakdown</strong> — Fixed totally outside the shoe to prevent skin breakdown and rubbing injuries.</li>
</ul>

<h2>Age Range and Sizing</h2>
<p>The XTERN Pediatric is suitable for children ages <strong>3 to 8 years old</strong>. It comes in a pediatric-specific size that accommodates growing feet.</p>

<h2>Why External AFOs Are Better for Kids</h2>
<p>Traditional internal AFOs can be uncomfortable for active children, limit shoe choices, and need frequent replacement as feet grow. The XTERN Pediatric''s external design means:</p>
<ul>
  <li>Children can wear the shoes they want, just like their friends</li>
  <li>No discomfort or rubbing on growing skin</li>
  <li>Adjustable as the child grows</li>
  <li>Easy for children to put on themselves</li>
  <li>Works with specialty footwear like sports cleats</li>
</ul>',
  'The XTERN Pediatric AFO is designed for children ages 3–8 with foot drop. It attaches externally, adjusts for growth, and fits any shoe including sports cleats.',
  'published',
  ARRAY['product', 'XTERN', 'pediatric', 'kids', 'children', 'AFO', 'foot drop'],
  'XTERN Pediatric AFO for Kids | Turbomed Orthotics',
  'The XTERN Pediatric AFO is designed for kids ages 3–8 with foot drop. External shoe attachment lets children wear any footwear.',
  4,
  NOW()
),

-- 5. AT-X Assessment Tool
(
  'AT-X Assessment Tool — Try the XTERN Before You Buy',
  'at-x-assessment-tool',
  'a0000000-0000-0000-0000-000000000001',
  'product_doc',
  '<h2>Overview</h2>
<p>The <strong>AT-X (Assessment Tool)</strong> is an adjustable demo brace designed exclusively for clinical evaluation by healthcare professionals. It allows patients to experience the XTERN''s dorsiflexion assistance before committing to a purchase.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>Symmetrical Design</strong> — Fits both right and left feet. Can be adjusted on any shoe size in just 1 minute.</li>
  <li><strong>Adjustable Fit</strong> — Features a length-modifiable front foot section and a height-adjustable calf cuff.</li>
  <li><strong>Same Performance</strong> — Offers the same dorsiflexion and mechanical efficiency as the final XTERN AFO.</li>
  <li><strong>Natural Gait</strong> — Dynamic dorsiflexion assistance provides an incomparable fluid and natural walking gait pattern.</li>
</ul>

<h2>Available Sizes</h2>
<p>The AT-X is available in:</p>
<ul>
  <li>Large</li>
  <li>Medium</li>
  <li>Small</li>
  <li>Pediatric</li>
  <li>Trial Kit (includes all three adult sizes)</li>
</ul>
<p>Suitable for shoe sizes US 2.5 to US 16.</p>

<h2>For Clinicians</h2>
<p>The AT-X lets your patients "try it now" and discover the comfort and function of the XTERN foot drop brace in your clinic. A 2-minute fitting on the patient''s own shoes is all it takes to demonstrate the XTERN''s benefits.</p>',
  'The AT-X is an adjustable demo brace for clinicians to let patients trial the XTERN in-clinic. Same performance as the final product.',
  'published',
  ARRAY['product', 'AT-X', 'assessment', 'demo', 'clinician', 'trial'],
  'AT-X Assessment Tool | Turbomed Orthotics',
  'The AT-X assessment tool lets patients trial the XTERN AFO in clinic. Adjustable, fits right and left, same performance as the final product.',
  5,
  NOW()
),

-- ------- CONDITIONS & TREATMENT ARTICLES -------

-- 6. Understanding Foot Drop
(
  'Understanding Foot Drop: Causes, Symptoms, and Treatment',
  'understanding-foot-drop',
  'a0000000-0000-0000-0000-000000000003',
  'article',
  '<h2>What Is Foot Drop?</h2>
<p>Foot drop (also called "drop foot") is a condition where you have difficulty lifting the front part of your foot due to weakness or paralysis of the muscles responsible for dorsiflexion. This can cause your foot to drag on the ground when you walk, leading to an abnormal gait pattern, tripping hazards, and fatigue.</p>
<p>Foot drop is not a disease itself — it is a symptom of an underlying neurological, muscular, or anatomical problem.</p>

<h2>Common Causes</h2>
<p>Foot drop can be caused by a wide range of conditions:</p>

<h3>Nerve Injuries</h3>
<ul>
  <li><strong>Peroneal nerve injury</strong> — The most common cause. The peroneal nerve controls the muscles that lift the foot. It can be compressed at the knee (e.g., from leg crossing, casts, or surgery).</li>
  <li><strong>Lumbar radiculopathy</strong> — Nerve root compression in the lower back (L4-L5) from herniated discs or spinal stenosis.</li>
  <li><strong>Sciatic nerve damage</strong> — Injury to the sciatic nerve from hip surgery or trauma.</li>
</ul>

<h3>Neurological Conditions</h3>
<ul>
  <li><strong>Stroke (CVA)</strong> — Brain damage affecting the motor cortex can cause foot drop on one side.</li>
  <li><strong>Multiple Sclerosis (MS)</strong> — Demyelination of nerves can impair signals to the foot-lifting muscles.</li>
  <li><strong>Cerebral Palsy (CP)</strong> — Congenital brain damage affecting motor control.</li>
  <li><strong>Charcot-Marie-Tooth disease (CMT)</strong> — An inherited peripheral neuropathy that commonly causes foot drop.</li>
  <li><strong>Guillain-Barré Syndrome</strong> — Autoimmune condition attacking peripheral nerves.</li>
  <li><strong>Amyotrophic Lateral Sclerosis (ALS)</strong> — Progressive motor neuron disease.</li>
</ul>

<h3>Other Causes</h3>
<ul>
  <li>Spinal cord injury</li>
  <li>Hip or knee replacement surgery complications</li>
  <li>Diabetes-related peripheral neuropathy</li>
  <li>Muscle disorders (muscular dystrophy)</li>
</ul>

<h2>Symptoms</h2>
<ul>
  <li>Difficulty lifting the front part of the foot</li>
  <li>Dragging the foot on the ground when walking</li>
  <li>Slapping the foot down with each step ("steppage gait")</li>
  <li>Lifting the knee higher than normal to compensate (high-stepping)</li>
  <li>Tripping and falling</li>
  <li>Numbness on the top of the foot or shin</li>
  <li>Muscle weakness in the foot and ankle</li>
</ul>

<h2>Treatment Options</h2>
<p>Treatment depends on the underlying cause and may include:</p>
<ul>
  <li><strong>Ankle Foot Orthoses (AFOs)</strong> — Braces that support the foot in a normal position. The Turbomed XTERN is an innovative external AFO that provides dynamic dorsiflexion assistance.</li>
  <li><strong>Physical therapy</strong> — Exercises to strengthen muscles and improve gait.</li>
  <li><strong>Nerve stimulation</strong> — Functional electrical stimulation (FES) devices.</li>
  <li><strong>Surgery</strong> — In some cases, nerve decompression or tendon transfer surgery.</li>
</ul>

<h2>How the XTERN Helps</h2>
<p>The Turbomed XTERN provides dynamic dorsiflexion assistance through its patented Exoskeleton Spring mechanism. Unlike rigid AFOs, the XTERN:</p>
<ul>
  <li>Allows natural plantar flexion to maintain calf muscle strength</li>
  <li>Provides a spring-like energy return that makes walking more natural</li>
  <li>Reduces fatigue and the risk of tripping</li>
  <li>Attaches externally — no skin contact, no discomfort</li>
</ul>',
  'Foot drop is a condition causing difficulty lifting the front of the foot. Learn about its causes (peroneal nerve injury, stroke, MS, CMT), symptoms, and treatment options.',
  'published',
  ARRAY['foot drop', 'causes', 'treatment', 'symptoms', 'peroneal nerve', 'stroke', 'MS'],
  'Understanding Foot Drop: Causes & Treatment | Turbomed',
  'Learn about foot drop — its causes (stroke, MS, nerve injury, CMT), symptoms, and treatment options including the Turbomed XTERN AFO.',
  1,
  NOW()
),

-- 7. XTERN vs Traditional AFOs
(
  'XTERN vs. Traditional AFOs: Why External Matters',
  'xtern-vs-traditional-afos',
  'a0000000-0000-0000-0000-000000000003',
  'article',
  '<h2>The Problem with Traditional AFOs</h2>
<p>Traditional ankle foot orthoses (AFOs) are worn <strong>inside the shoe</strong>, in direct contact with the skin. While they can support the foot, they come with significant drawbacks:</p>
<ul>
  <li><strong>Skin irritation and blisters</strong> — Constant contact with the foot and ankle causes rubbing, sweating, and skin breakdown.</li>
  <li><strong>Shoe size changes</strong> — The brace takes up room inside the shoe, often requiring you to buy shoes 1–2 sizes larger.</li>
  <li><strong>Limited shoe choices</strong> — Many shoes simply won''t fit over a traditional AFO. Forget about boots, dress shoes, or athletic footwear.</li>
  <li><strong>Rigid design</strong> — Most traditional AFOs restrict plantar flexion, leading to calf muscle weakness over time.</li>
  <li><strong>Discomfort during activity</strong> — Heat, sweat, and pressure increase during exercise.</li>
</ul>

<h2>How the XTERN Is Different</h2>
<p>The Turbomed XTERN takes an entirely different approach. It''s an <strong>external AFO</strong> — mounted completely outside the shoe — with a dynamic spring mechanism.</p>

<h3>No Skin Contact</h3>
<p>The XTERN never touches your foot or ankle. This eliminates blisters, rubbing, and skin breakdown entirely. The only contact point is the calf pad, which sits comfortably on the shin.</p>

<h3>Wear Any Shoe</h3>
<p>Because the XTERN attaches to the outside of the shoe via lace-clips, you can wear <strong>any laced shoe</strong> in your normal size — sneakers, hiking boots, winter boots, safety boots, and more. Switch between shoes in seconds.</p>

<h3>Dynamic Movement</h3>
<p>Unlike rigid AFOs that lock your ankle, the XTERN''s Exoskeleton Spring provides dynamic dorsiflexion assistance while allowing full plantar flexion. This means:</p>
<ul>
  <li>Your calf muscles stay active and strong</li>
  <li>Your ankle retains its natural range of motion</li>
  <li>Walking feels more natural and less fatiguing</li>
  <li>You can run, hike, and play sports</li>
</ul>

<h3>Energy Return System</h3>
<p>The XTERN''s spring mechanism stores energy during plantar flexion and releases it during the swing phase of gait. This energy return system makes each step more efficient and reduces fatigue — especially important for all-day wear.</p>

<h3>Quick Comparison</h3>
<table>
  <tr><th>Feature</th><th>Traditional AFO</th><th>XTERN</th></tr>
  <tr><td>Placement</td><td>Inside shoe</td><td>Outside shoe</td></tr>
  <tr><td>Skin contact</td><td>Full foot/ankle</td><td>None (calf pad only)</td></tr>
  <tr><td>Shoe compatibility</td><td>Limited, larger size needed</td><td>Any laced shoe, normal size</td></tr>
  <tr><td>Ankle motion</td><td>Restricted (rigid)</td><td>Full range preserved</td></tr>
  <tr><td>Calf muscle</td><td>Weakens over time</td><td>Stays active</td></tr>
  <tr><td>Switch shoes</td><td>Difficult, refitting needed</td><td>Seconds</td></tr>
  <tr><td>Activity level</td><td>Walking only</td><td>Walking, running, sports, hiking</td></tr>
  <tr><td>Skin issues</td><td>Blisters, rubbing, sweating</td><td>None</td></tr>
</table>',
  'Compare the Turbomed XTERN external AFO to traditional inside-shoe braces. Learn why external attachment, dynamic springs, and full ankle motion make a difference.',
  'published',
  ARRAY['AFO', 'comparison', 'traditional', 'external', 'benefits'],
  'XTERN vs Traditional AFOs | Turbomed Orthotics',
  'Compare the XTERN external AFO to traditional inside-shoe braces. External design means no skin contact, any shoe fits, and full ankle range of motion.',
  2,
  NOW()
),

-- 8. How the XTERN Works
(
  'How the XTERN Works: Exoskeleton Spring Technology',
  'how-xtern-works',
  'a0000000-0000-0000-0000-000000000003',
  'article',
  '<h2>The Exoskeleton Spring Principle</h2>
<p>The Turbomed XTERN uses a patented <strong>Exoskeleton Spring</strong> design that acts as an external support structure for the impaired limb. Rather than rigidly holding the foot in position like traditional AFOs, the XTERN provides <strong>dynamic dorsiflexion assistance</strong> through a spring mechanism.</p>

<h2>How It Works Step by Step</h2>
<ol>
  <li><strong>Heel Strike</strong> — As your heel contacts the ground, the XTERN''s spring is in a neutral position.</li>
  <li><strong>Foot Flat / Stance Phase</strong> — As your foot rolls forward into plantar flexion, the spring stores energy. The XTERN allows this natural motion, keeping your calf muscles active.</li>
  <li><strong>Toe Off</strong> — As you push off, the spring is at maximum tension.</li>
  <li><strong>Swing Phase</strong> — The stored energy is released, providing dorsiflexion assistance to lift the foot and clear the ground. This is the critical phase for foot drop patients.</li>
</ol>

<h2>Energy Return System</h2>
<p>The XTERN has the <strong>largest possible tangential spring lever</strong> of any AFO, making it the most comfortable and most functional. The energy return system means:</p>
<ul>
  <li>Each step is more efficient — less effort required from the user</li>
  <li>Reduced fatigue during long walks or all-day wear</li>
  <li>More natural, fluid gait pattern</li>
  <li>Decreased risk of tripping and falling</li>
</ul>

<h2>External Attachment</h2>
<p>The XTERN attaches to the shoe via <strong>lace-clips</strong> — small connectors secured to the shoe''s lace eyelets with zip ties. The calf pad wraps around the shin with a velcro strap. This external design means:</p>
<ul>
  <li>Zero contact with the foot — no blisters or rubbing</li>
  <li>Normal shoe size — no bulky inserts</li>
  <li>Quick shoe changes — move the XTERN between shoes in seconds</li>
</ul>

<h2>Preserving Muscle Strength</h2>
<p>A key advantage of the XTERN''s dynamic design is that it does not prevent plantar flexion. Traditional rigid AFOs hold the ankle at 90 degrees, which over time leads to calf muscle atrophy. The XTERN lets the calf muscles work naturally, helping maintain strength and joint mobility.</p>',
  'Learn how the XTERN''s patented Exoskeleton Spring technology provides dynamic dorsiflexion assistance with energy return, while preserving natural ankle motion.',
  'published',
  ARRAY['how it works', 'exoskeleton', 'spring', 'dorsiflexion', 'technology'],
  'How the XTERN Works | Turbomed Orthotics',
  'Understand the XTERN''s Exoskeleton Spring technology — dynamic dorsiflexion assist with energy return that preserves natural ankle movement.',
  3,
  NOW()
),

-- ------- FITTING & SIZING ARTICLES -------

-- 9. Sizing Guide
(
  'XTERN Sizing Guide: Finding Your Perfect Fit',
  'xtern-sizing-guide',
  'a0000000-0000-0000-0000-000000000002',
  'article',
  '<h2>Sizing Overview</h2>
<p>The XTERN comes in <strong>four sizes</strong>: Pediatric, Small, Medium, and Large. The correct size is determined primarily by your shoe size, though proper width and fit should always be confirmed.</p>

<h2>Size Chart</h2>
<table>
  <tr><th>XTERN Size</th><th>Men''s US Shoe</th><th>Women''s US Shoe</th></tr>
  <tr><td>Pediatric</td><td>2.5 – 5</td><td>3.5 – 6</td></tr>
  <tr><td>Small</td><td>5 – 8</td><td>6 – 9</td></tr>
  <tr><td>Medium</td><td>8 – 11</td><td>9 – 12</td></tr>
  <tr><td>Large</td><td>11 – 16</td><td>12+</td></tr>
</table>

<h2>Front Hoop Length</h2>
<p>The Front Hoop Length is initially determined by shoe size but should be properly adjusted based on the shoes you will most often wear. Your orthotist or fitter will adjust this during your fitting appointment.</p>

<h2>Width Considerations</h2>
<p>Ensure that the correlating shoe size fits the width comfortably. If you wear wide shoes, this may affect how the lace-clips sit on the shoe. Your clinician can help verify proper fit.</p>

<h2>Getting Sized</h2>
<p>For the most accurate sizing, we recommend:</p>
<ol>
  <li><strong>Visit a clinic</strong> — More than 400 O&P clinics in the US carry the XTERN. Your clinician can use the AT-X assessment tool to trial-fit the brace.</li>
  <li><strong>Bring your shoes</strong> — Bring the shoes you wear most often to your sizing appointment.</li>
  <li><strong>Order online</strong> — If ordering directly, provide your sex and shoe size for custom fitting.</li>
</ol>',
  'Find the right XTERN size based on your shoe size. Available in Pediatric, Small, Medium, and Large to fit US shoe sizes 2.5 to 16.',
  'published',
  ARRAY['sizing', 'fitting', 'guide', 'size chart', 'shoes'],
  'XTERN Sizing Guide | Turbomed Orthotics',
  'Find the right XTERN size based on your shoe size. Available in Pediatric, Small, Medium, and Large for US 2.5 to 16.',
  1,
  NOW()
),

-- 10. Shoe Compatibility
(
  'Shoe Compatibility: What Shoes Work with the XTERN?',
  'shoe-compatibility',
  'a0000000-0000-0000-0000-000000000002',
  'article',
  '<h2>Compatible Shoes</h2>
<p>The XTERN will fit onto nearly every shoe. The only requirements are:</p>
<ul>
  <li><strong>Laces or a sturdy strap</strong> across the front of the foot (for lace-clip attachment)</li>
  <li><strong>A heel</strong> on the shoe (for the heel support)</li>
</ul>

<h2>Recommended Shoe Types</h2>
<p>For the best experience, choose shoes with:</p>
<ul>
  <li>A <strong>wide toe box</strong> for comfort</li>
  <li><strong>Robust fabric</strong> that holds the lace-clips securely</li>
  <li>A <strong>firm heel cap</strong> for stable heel support contact</li>
  <li><strong>Ridges on the sole contour</strong> to help hold the orthotic in place</li>
</ul>

<h3>Great Choices</h3>
<ul>
  <li>Athletic/running shoes</li>
  <li>Hiking boots</li>
  <li>Winter boots</li>
  <li>Safety/work boots</li>
  <li>Walking shoes</li>
  <li>Cross-trainers</li>
  <li>Children''s sports cleats (with pediatric XTERN)</li>
</ul>

<h3>Shoes That May Not Work</h3>
<ul>
  <li>Slip-on shoes without laces or straps</li>
  <li>Open-back sandals or clogs</li>
  <li>High heels</li>
  <li>Flat shoes with no heel</li>
  <li>Very flexible/soft shoes without structure</li>
</ul>

<h2>Switching Between Shoes</h2>
<p>One of the XTERN''s biggest advantages is the ability to switch between shoes in seconds. Simply:</p>
<ol>
  <li>Install lace-clips on each pair of shoes you wear regularly (5 clips are included with the CLASSIC+, 10 with the SUMMIT)</li>
  <li>Clip the XTERN onto whichever shoe you''re wearing that day</li>
  <li>Detach and re-attach in seconds</li>
</ol>
<p>This means one XTERN works with your entire shoe collection.</p>',
  'The XTERN fits nearly any shoe with laces and a heel. Learn which shoe types work best and how to switch between shoes in seconds.',
  'published',
  ARRAY['shoes', 'compatibility', 'fitting', 'laces', 'boots'],
  'XTERN Shoe Compatibility Guide | Turbomed Orthotics',
  'Learn which shoes work with the XTERN AFO. Fits athletic shoes, hiking boots, winter boots, and more. Switch between shoes in seconds.',
  2,
  NOW()
),

-- 11. How to Put On Your XTERN
(
  'How to Put On and Use Your XTERN',
  'how-to-put-on-xtern',
  'a0000000-0000-0000-0000-000000000002',
  'article',
  '<h2>Initial Setup</h2>
<p>Before first use, you''ll need to install lace-clips on your shoes:</p>
<ol>
  <li>Install the lace-clips on the front eyelets of your shoes using the provided zip ties.</li>
  <li><strong>Important:</strong> Attach zip ties through the eyelets only — never attach them around the laces.</li>
  <li>Trim excess zip tie length after securing.</li>
</ol>

<h2>Putting On the XTERN (Daily Use)</h2>
<ol>
  <li><strong>Attach to shoe</strong> — Clip the XTERN''s front hoop onto the lace-clips on your shoe.</li>
  <li><strong>Put on your shoe</strong> — Depending on your mobility, sit on a chair or the floor. Slip your foot into the shoe through the side opening.</li>
  <li><strong>Position the calf pad</strong> — Move the calf pad behind your calf/shin.</li>
  <li><strong>Secure your foot</strong> — Make sure your foot is comfortable, then lace up your shoe normally.</li>
  <li><strong>Fasten the strap</strong> — Attach the velcro strap across your shin to secure the calf pad.</li>
</ol>

<h2>For XTERN FRONTIER Users</h2>
<p>The FRONTIER model features a <strong>frontal approach</strong> with magnetic buckles:</p>
<ol>
  <li>The leg support leaves the back of the shoe fully open for easy donning.</li>
  <li>The magnetic buckle system can be operated with <strong>one hand</strong>.</li>
  <li>Simply bring the magnetic buckle close and it snaps into place.</li>
</ol>

<h2>Tips for Best Results</h2>
<ul>
  <li>Ensure your shoe is laced snugly — a secure foot means better XTERN performance.</li>
  <li>The calf pad should sit comfortably against your shin, not too tight or too loose.</li>
  <li>Walk a few steps to confirm everything feels natural before heading out.</li>
</ul>',
  'Step-by-step instructions for installing lace-clips, putting on the XTERN daily, and tips for the best fit. Includes FRONTIER one-handed instructions.',
  'published',
  ARRAY['instructions', 'how to', 'donning', 'setup', 'lace clips'],
  'How to Put On Your XTERN | Turbomed Orthotics',
  'Step-by-step guide for putting on and using your XTERN AFO, including initial lace-clip setup and daily donning instructions.',
  3,
  NOW()
),

-- ------- INSURANCE & PRICING ARTICLES -------

-- 12. Pricing & Insurance
(
  'XTERN Pricing and Insurance Coverage',
  'xtern-pricing-insurance',
  'a0000000-0000-0000-0000-000000000004',
  'article',
  '<h2>Pricing</h2>
<p>The XTERN''s price in the United States typically ranges between <strong>$975 and $1,200 USD</strong>, depending on the model and where you purchase it.</p>

<h2>Insurance Coverage</h2>
<p>The XTERN is covered by various insurance plans in the United States, including:</p>
<ul>
  <li><strong>Medicare</strong></li>
  <li><strong>Medicaid</strong></li>
  <li><strong>Veterans Affairs (VA)</strong></li>
  <li><strong>Most private insurance companies</strong></li>
</ul>

<h2>HCPCS Codes</h2>
<p>The XTERN has received <strong>PDAC validation</strong> (Pricing, Data Analysis, and Coding) which makes insurance and Medicare reimbursement easier and faster.</p>
<table>
  <tr><th>Product</th><th>HCPCS Code</th></tr>
  <tr><td>XTERN SUMMIT</td><td>L1951</td></tr>
  <tr><td>XTERN CLASSIC+</td><td>L1951</td></tr>
  <tr><td>XTERN FRONTIER</td><td>L1932</td></tr>
</table>
<p>HCPCS Code <strong>L1951</strong> is defined as: "Ankle foot orthosis, spiral, (Institute of Rehabilitative Medicine type), plastic or other material, prefabricated, includes fitting and adjustment."</p>

<h2>How to Use Insurance</h2>
<ol>
  <li><strong>Get a prescription</strong> — While a prescription is not always required, having one from your doctor makes insurance claims much easier.</li>
  <li><strong>Visit an in-network provider</strong> — Purchase from an O&P clinic, DME store, or provider that accepts your insurance.</li>
  <li><strong>Submit the HCPCS code</strong> — Your provider will bill using the appropriate L-code for reimbursement.</li>
  <li><strong>Check your benefits</strong> — Contact your insurance company to verify orthotics coverage under your specific plan.</li>
</ol>

<h2>Purchasing Without Insurance</h2>
<p>You can also purchase the XTERN directly through authorized retailers. Many offer payment plans or accept HSA/FSA cards.</p>',
  'The XTERN costs $975–$1,200 USD and is covered by Medicare, Medicaid, VA, and most insurance plans under HCPCS codes L1951 and L1932.',
  'published',
  ARRAY['pricing', 'insurance', 'Medicare', 'Medicaid', 'HCPCS', 'cost'],
  'XTERN Pricing & Insurance | Turbomed Orthotics',
  'XTERN pricing ($975–$1,200 USD), insurance coverage (Medicare, Medicaid, VA), and HCPCS codes (L1951, L1932) for reimbursement.',
  1,
  NOW()
),

-- ------- GETTING STARTED ARTICLES -------

-- 13. How to Get the XTERN
(
  'How to Get Your XTERN Foot Drop Brace',
  'how-to-get-xtern',
  'a0000000-0000-0000-0000-000000000005',
  'article',
  '<h2>No Prescription Required</h2>
<p>You <strong>do not need a prescription</strong> to purchase an XTERN, though we recommend getting a definitive foot drop diagnosis from a medical professional. Having a prescription also makes insurance reimbursement easier.</p>

<h2>Option 1: Through a Local Clinic</h2>
<p>More than <strong>400 O&P clinics, DME stores, podiatrists, and physical therapy centers</strong> sell the XTERN across the United States.</p>
<ol>
  <li><strong>Contact a clinic</strong> — Arrange an assessment appointment. Bring running-type trainers and/or walking boots on the day.</li>
  <li><strong>Assessment</strong> — The orthotist performs clinical tests to ensure the XTERN is appropriate for your condition. They may use the AT-X assessment tool to let you trial the brace.</li>
  <li><strong>Trial walk</strong> — Walk, run, squat, or transfer between chairs to confirm the biomechanics work for you.</li>
  <li><strong>Fitting</strong> — The orthotist checks the device is functioning correctly, installs lace-clips on your shoes, and provides wear-and-care advice.</li>
</ol>

<h2>Option 2: Order Online</h2>
<p>You can purchase the XTERN through the Turbomed online store or authorized retailers like KevinRoot Medical. You''ll provide your sex and shoe size for custom fitting.</p>

<h2>Option 3: Through Your Doctor</h2>
<p>Ask your physician, neurologist, or physiatrist about the Turbomed XTERN. They can write a prescription and refer you to a local provider for fitting.</p>

<h2>30-Day Money-Back Guarantee</h2>
<p>If you receive your XTERN and it doesn''t support your condition within the first 30 days, you can return it for a <strong>100% refund</strong> (minus shipping).</p>

<h2>What Happens After Purchase</h2>
<ul>
  <li>Your XTERN comes with lace-clips, calf pads, straps, and instructions</li>
  <li>Install lace-clips on your favorite shoes</li>
  <li>Start using your XTERN immediately</li>
  <li>2-year warranty covers any breaks</li>
</ul>',
  'No prescription is needed to get the XTERN. Purchase through 400+ clinics nationwide, order online, or get a referral from your doctor. 30-day money-back guarantee.',
  'published',
  ARRAY['how to get', 'purchase', 'clinic', 'online', 'prescription'],
  'How to Get the XTERN | Turbomed Orthotics',
  'Learn how to get your XTERN foot drop brace — through 400+ clinics, online ordering, or doctor referral. No prescription required. 30-day guarantee.',
  1,
  NOW()
),

-- ------- PARTS & ACCESSORIES ARTICLES -------

-- 14. Replacement Parts
(
  'XTERN Replacement Parts and Accessories',
  'xtern-replacement-parts',
  'a0000000-0000-0000-0000-000000000006',
  'article',
  '<h2>Available Replacement Parts</h2>
<p>Turbomed offers a full range of replacement parts and accessories to keep your XTERN in top condition:</p>

<h3>Lace-Clips (Shoe Connectors)</h3>
<p>Lace-clips connect the XTERN to your shoe through the lace eyelets. Extra clips let you install them on multiple shoes so you can switch the XTERN between footwear instantly. Available in packs.</p>

<h3>Calf Pad and Strap Kit</h3>
<p>Replacement calf pads and velcro straps for comfortable shin contact. Available in Small, Medium, and Large sizes to match your XTERN.</p>

<h3>Ankle Strap</h3>
<p>An additional ankle stabilization strap available in Small, Medium, and Large for extra support.</p>

<h3>Extension Stopper Kit</h3>
<p>An add-on part for the XTERN that limits extension range. Useful for customizing the spring behavior to your specific needs.</p>

<h3>Heel Bumper Kit</h3>
<p>A heel bumper accessory that provides additional heel support and stability.</p>

<h2>Ordering Parts</h2>
<p>Replacement parts can be ordered through:</p>
<ul>
  <li>The Turbomed online store</li>
  <li>Your local O&P clinic</li>
  <li>Authorized retailers</li>
</ul>

<h2>Warranty Replacement</h2>
<p>If your XTERN breaks within the 2-year warranty period, contact support with a photo of the damage for a warranty replacement. Email <strong>hello@kevinorthopedic.com</strong> for warranty claims.</p>',
  'Browse replacement parts for the XTERN including lace-clips, calf pads, ankle straps, extension stoppers, and heel bumpers.',
  'published',
  ARRAY['parts', 'accessories', 'replacement', 'lace clips', 'straps', 'pads'],
  'XTERN Replacement Parts | Turbomed Orthotics',
  'Order XTERN replacement parts — lace-clips, calf pads, ankle straps, extension stoppers, and heel bumpers. Plus warranty information.',
  1,
  NOW()
),

-- ------- ABOUT TURBOMED ARTICLES -------

-- 15. About Turbomed Orthotics
(
  'About Turbomed Orthotics: Our Story',
  'about-turbomed-orthotics',
  'a0000000-0000-0000-0000-000000000007',
  'article',
  '<h2>Our Origin</h2>
<p>In 2001, <strong>François Côté</strong> suffered several injuries during a snowmobile accident. After rehabilitation, he was left with a permanent condition — foot drop in his left foot, caused by damage to the levator muscle.</p>
<p>Determined to remain active and improve his mobility, François used his talents as a draftsman to design an orthosis in his garage. He tested each prototype himself during races and outdoor activities. <strong>Twenty-eight prototypes</strong> were created and tested before arriving at the current design.</p>

<h2>From Garage to Global</h2>
<p>After meeting <strong>Stéphane Savard</strong>, the two perfected the product and began commercial distribution in <strong>March 2015</strong>. In October 2017, Turbomed opened a new 6,000-square-foot head office.</p>
<p>Today, Turbomed orthotics are <strong>distributed in over 35 countries</strong> worldwide, with more than 400 O&P clinics, DME stores, podiatrists, and physical therapy centers in the United States alone.</p>

<h2>Our Mission</h2>
<p>Turbomed''s mission is simple: to give people with foot drop their lives back. The XTERN was born from a real patient''s frustration with existing solutions — and designed to let you <strong>move, run, and live fully</strong>.</p>

<h2>Innovation</h2>
<p>The patented Exoskeleton Spring technology represents a fundamental rethink of how AFOs should work. Instead of rigid braces worn inside the shoe, the XTERN is:</p>
<ul>
  <li>External — no skin contact</li>
  <li>Dynamic — spring-assisted, not rigid</li>
  <li>Universal — fits any laced shoe</li>
  <li>Active — preserves natural ankle motion and muscle strength</li>
</ul>

<h2>Global Presence</h2>
<p>Turbomed is headquartered in <strong>Quebec, Canada</strong> with distribution partners across North America, Europe, Asia-Pacific, and beyond. The US market is served through <strong>TurboMed USA</strong>.</p>',
  'Turbomed Orthotics was founded after inventor François Côté developed foot drop from a snowmobile accident. After 28 prototypes, the XTERN was born.',
  'published',
  ARRAY['about', 'company', 'history', 'story', 'mission'],
  'About Turbomed Orthotics | Our Story',
  'Learn how Turbomed Orthotics was founded — from a snowmobile accident to 28 prototypes to a globally distributed foot drop solution.',
  1,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- FAQs
-- ============================================================

INSERT INTO kb_faqs (question, answer, category_id, status, sort_order) VALUES

-- General FAQs
(
  'What is the XTERN?',
  '<p>The XTERN is an innovative <strong>external ankle foot orthosis (AFO)</strong> designed for people with foot drop. Unlike traditional braces worn inside the shoe, the XTERN attaches completely outside the shoe using lace-clips. Its patented Exoskeleton Spring provides dynamic dorsiflexion assistance — a spring-like action that lifts the foot during walking — while preserving natural ankle motion and calf muscle strength.</p>',
  'a0000000-0000-0000-0000-000000000001',
  'published',
  1
),
(
  'How does the XTERN work?',
  '<p>The XTERN uses a patented <strong>Exoskeleton Spring</strong> mechanism that stores energy during plantar flexion (when your foot pushes down) and releases it during the swing phase of walking to lift the foot and clear the ground. This energy return system makes walking more natural, reduces fatigue, and decreases the risk of tripping. Unlike rigid AFOs, the XTERN allows full plantar flexion to keep your calf muscles active.</p>',
  'a0000000-0000-0000-0000-000000000001',
  'published',
  2
),
(
  'What conditions does the XTERN treat?',
  '<p>The XTERN is designed for <strong>foot drop</strong> (drop foot) and dorsiflexion weakness caused by:</p>
<ul>
  <li>Peroneal nerve injury</li>
  <li>Stroke (CVA)</li>
  <li>Multiple Sclerosis (MS)</li>
  <li>Charcot-Marie-Tooth disease (CMT)</li>
  <li>Cerebral Palsy (CP)</li>
  <li>Guillain-Barré Syndrome</li>
  <li>Spinal cord injury</li>
  <li>Lumbar radiculopathy</li>
  <li>Diabetes-related peripheral neuropathy</li>
</ul>',
  'a0000000-0000-0000-0000-000000000003',
  'published',
  3
),
(
  'Do I need a prescription to buy the XTERN?',
  '<p>No, you <strong>do not need a prescription</strong> to purchase an XTERN. However, we recommend getting a definitive foot drop diagnosis from a medical professional. Having a prescription can also make insurance reimbursement easier.</p>',
  'a0000000-0000-0000-0000-000000000005',
  'published',
  4
),

-- Product Comparison FAQs
(
  'What is the difference between the CLASSIC+, SUMMIT, and FRONTIER?',
  '<p>Turbomed offers three adult XTERN models:</p>
<ul>
  <li><strong>XTERN CLASSIC+</strong> — The flagship model with MonoCore technology. A great all-around choice for most patients. HCPCS Code: L1951.</li>
  <li><strong>XTERN SUMMIT</strong> — The latest model, 25% lighter (275g) and 18% more dorsal lift than the CLASSIC. Lowest profile design. Comes with 10 lace clips and 2 sets of pads. HCPCS Code: L1951.</li>
  <li><strong>XTERN FRONTIER</strong> — Designed for patients with reduced hand dexterity (e.g., stroke survivors). Features a magnetic buckle system operable with one hand and a frontal approach for easy donning. HCPCS Code: L1932.</li>
</ul>',
  'a0000000-0000-0000-0000-000000000001',
  'published',
  5
),
(
  'Is there a pediatric version of the XTERN?',
  '<p>Yes! The <strong>XTERN Pediatric</strong> is designed for children ages 3–8 with foot drop. It attaches externally to the shoe just like the adult versions, so children can wear normal shoes including sports cleats. The pediatric version is adjustable to accommodate growth, ensuring the maximum lifespan of the brace.</p>',
  'a0000000-0000-0000-0000-000000000001',
  'published',
  6
),

-- Fitting & Sizing FAQs
(
  'What shoes can I wear with the XTERN?',
  '<p>The XTERN fits onto <strong>nearly every shoe</strong>. The requirements are:</p>
<ul>
  <li>Laces or a sturdy strap across the front of the foot</li>
  <li>A heel on the shoe</li>
</ul>
<p>Great choices include athletic/running shoes, hiking boots, winter boots, safety boots, and walking shoes. For the best results, choose shoes with a wide toe box, robust fabric, a firm heel cap, and ridges on the sole. Shoes that won''t work include slip-ons, open-back sandals, high heels, and flat shoes without a heel.</p>',
  'a0000000-0000-0000-0000-000000000002',
  'published',
  7
),
(
  'What sizes does the XTERN come in?',
  '<p>The XTERN is available in <strong>four sizes</strong>: Pediatric, Small, Medium, and Large. The correct size is based on your shoe size and covers the full range from US 2.5 to US 16. Your clinician or fitter will help determine the ideal size during assessment.</p>',
  'a0000000-0000-0000-0000-000000000002',
  'published',
  8
),
(
  'Can I switch the XTERN between different shoes?',
  '<p>Yes! This is one of the XTERN''s biggest advantages. Simply install <strong>lace-clips</strong> on each pair of shoes you wear regularly. Then clip the XTERN onto whichever shoe you''re wearing that day — it takes just <strong>seconds</strong> to switch. The CLASSIC+ comes with 5 clips and the SUMMIT comes with 10.</p>',
  'a0000000-0000-0000-0000-000000000002',
  'published',
  9
),
(
  'How do I put on the XTERN?',
  '<p>Daily use is simple:</p>
<ol>
  <li>Clip the XTERN''s front hoop onto the lace-clips on your shoe</li>
  <li>Slip your foot into the shoe</li>
  <li>Position the calf pad behind your shin</li>
  <li>Lace up your shoe</li>
  <li>Fasten the velcro strap across your shin</li>
</ol>
<p>For the <strong>XTERN FRONTIER</strong>, the magnetic buckle system allows one-handed operation — just bring the buckle close and it snaps into place.</p>',
  'a0000000-0000-0000-0000-000000000002',
  'published',
  10
),

-- Insurance & Pricing FAQs
(
  'How much does the XTERN cost?',
  '<p>The XTERN''s price in the United States typically ranges between <strong>$975 and $1,200 USD</strong>, depending on the model and retailer.</p>',
  'a0000000-0000-0000-0000-000000000004',
  'published',
  11
),
(
  'Does insurance cover the XTERN?',
  '<p>Yes, the XTERN is covered by <strong>Medicare, Medicaid, the VA</strong>, and most private insurance plans. The XTERN has received PDAC validation, which makes insurance reimbursement easier and faster. The HCPCS codes are:</p>
<ul>
  <li><strong>L1951</strong> — XTERN SUMMIT and CLASSIC+</li>
  <li><strong>L1932</strong> — XTERN FRONTIER</li>
</ul>
<p>Contact your insurance company to verify orthotics coverage under your specific plan.</p>',
  'a0000000-0000-0000-0000-000000000004',
  'published',
  12
),

-- Warranty & Returns FAQs
(
  'What is the warranty on the XTERN?',
  '<p>The XTERN comes with a <strong>2-year warranty against breakage</strong>. If your brace breaks within 2 years of purchase, Turbomed will cover the replacement. To file a warranty claim, contact support with a photo of the damage.</p>',
  'a0000000-0000-0000-0000-000000000006',
  'published',
  13
),
(
  'What is the return policy?',
  '<p>If you receive your XTERN and it doesn''t support your condition, you can return it within the first <strong>30 days</strong> for a <strong>100% refund</strong> (minus shipping), no questions asked. If you''re outside the 30-day period, contact customer support to discuss refund and exchange options.</p>',
  'a0000000-0000-0000-0000-000000000004',
  'published',
  14
),

-- Troubleshooting FAQs
(
  'What if the XTERN feels loose or unstable on my shoe?',
  '<p>Make sure your shoe has a <strong>firm heel cap</strong> — soft or flexible heels won''t hold the XTERN''s heel support properly. Also check that:</p>
<ul>
  <li>The lace-clips are securely installed on the eyelets (not around the laces)</li>
  <li>Your shoe laces are snug</li>
  <li>You''re using a shoe with ridged sole contours to grip the heel support</li>
</ul>
<p>If the issue persists, visit your clinician for a fitting adjustment.</p>',
  'a0000000-0000-0000-0000-000000000002',
  'published',
  15
),
(
  'Can I use the XTERN for running and sports?',
  '<p>Yes! The XTERN was <strong>engineered to handle impact, terrain, and speed</strong>. Unlike traditional AFOs that limit dynamic movement, the XTERN''s spring mechanism and external design allow you to walk, run, hike, play tennis, and participate in many sports. The energy return system actually makes active use more comfortable by reducing fatigue.</p>',
  'a0000000-0000-0000-0000-000000000003',
  'published',
  16
),
(
  'Where can I buy the XTERN?',
  '<p>You can purchase the XTERN through:</p>
<ul>
  <li><strong>400+ authorized clinics</strong> — O&P clinics, DME stores, podiatrists, and physical therapy centers across the US</li>
  <li><strong>Online</strong> — Through the Turbomed USA online store or authorized retailers</li>
  <li><strong>International</strong> — Available in 35+ countries through local distributors</li>
</ul>
<p>Visit <a href="https://turbomedusa.com">turbomedusa.com</a> (USA) or <a href="https://turbomedorthotics.com">turbomedorthotics.com</a> (international) to find a provider near you.</p>',
  'a0000000-0000-0000-0000-000000000005',
  'published',
  17
),
(
  'How is the XTERN different from a traditional AFO?',
  '<p>The key differences are:</p>
<table>
  <tr><th>Feature</th><th>Traditional AFO</th><th>XTERN</th></tr>
  <tr><td>Placement</td><td>Inside shoe</td><td>Outside shoe</td></tr>
  <tr><td>Skin contact</td><td>Full foot/ankle</td><td>None (calf pad only)</td></tr>
  <tr><td>Shoe compatibility</td><td>Limited, larger size needed</td><td>Any laced shoe, normal size</td></tr>
  <tr><td>Ankle motion</td><td>Restricted (rigid)</td><td>Full range preserved</td></tr>
  <tr><td>Calf muscle</td><td>Weakens over time</td><td>Stays active</td></tr>
  <tr><td>Activity level</td><td>Walking only</td><td>Walking, running, sports</td></tr>
</table>',
  'a0000000-0000-0000-0000-000000000003',
  'published',
  18
);
