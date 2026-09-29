const fs = require('fs');
const path = require('path');

function cleanup(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanup(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // 1. Fix React import
      content = content.replace(/import React(, \{[^}]+\})? from 'react';/, (match, p1) => {
        if (p1) {
          return `import ${p1.replace(/^, \{/, '{')} from 'react';`;
        }
        return '';
      });
      content = content.replace(/import React from 'react';\r?\n/, '');

      // 2. Fix unused catch parameters (e.g. catch (err) -> catch (_err) or remove it if possible, but let's just use `catch (err) { console.error(err); }` or remove err if not used)
      // Actually, ESLint just allows `catch (err)` if we don't use it. Oh wait, `catch (error)` is fine if we log it. But ESLint throws `no-unused-vars`. 
      // The cleaner way in modern JS is just `catch {` instead of `catch (err) {`.
      content = content.replace(/catch \(\w+\) \{\s+setError\(/g, 'catch {\n      setError(');
      content = content.replace(/catch \(\w+\) \{\s+alert\(/g, 'catch {\n      alert(');

      fs.writeFileSync(fullPath, content);
    }
  }
}

cleanup(path.join(__dirname, 'src'));

// Also fix specific files for unused imports
const homePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
if (fs.existsSync(homePath)) {
  let homeContent = fs.readFileSync(homePath, 'utf8');
  homeContent = homeContent.replace(/import \{ useNavigate \} from 'react-router-dom';\r?\n/, '');
  fs.writeFileSync(homePath, homeContent);
}

const tripPlannerPath = path.join(__dirname, 'src', 'pages', 'TripPlanner.jsx');
if (fs.existsSync(tripPlannerPath)) {
  let plannerContent = fs.readFileSync(tripPlannerPath, 'utf8');
  plannerContent = plannerContent.replace(/import Loading from '\.\.\/components\/Loading';\r?\n/, '');
  fs.writeFileSync(tripPlannerPath, plannerContent);
}

const myTripsPath = path.join(__dirname, 'src', 'pages', 'MyTrips.jsx');
if (fs.existsSync(myTripsPath)) {
  let myTripsContent = fs.readFileSync(myTripsPath, 'utf8');
  myTripsContent = myTripsContent.replace(/\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\r?\n/, '');
  fs.writeFileSync(myTripsPath, myTripsContent);
}
