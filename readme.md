# Firepoker-Ion

Planing poker application, based on Angular and Firebase, which integrates with JIRA.

A Chrome Browser Extension can be found at client/extensions/chrome.crx.
Install by dragging and dropping on extensions window in Chrome.

File issues @ https://bitbucket.org/dwaldo/firepoker-ion/issues

## Build
This project has a dependency on Ruby for Sass.
Install Ruby, then...
> gem install sass

First duplicate `.env.sample => .env`. This saves all your environment variables.

> npm install

// in separate tab
> npm start  // npm run-script dev  to restart server on change

// build clientside app
> gulp build  

// for incremental rebuilds
> gulp dev

// to run the test suite
> gulp tdd

// for deploy to AppDev2012
> gulp deploy

```

## Projects Initial Goals:
 * Integration with JIRA
JQL to retrieve issues to estimate, story point field is customfield_10004
* Save estimated stories back to JIRA
*	Pull up games to get report of estimate accuracy, vs. JIRA

* Teams of users
 * Allow users to create teams of players to use on games
*	Games
 * History of each estimation made by team members
 * Date & Time (games expire)?
 * Discussion - possible integration with JIRA/BitBucket?
 * Report on consensus - Users can update vote & most recent vote wins
* Users Game Queue
  * Show players games they are a part of when the log into the system
  * Notify players when a new game is ready to play, possibly with
* Chrome Extension for notifications
  * Reminders with expires to gauge players performance
  * When all members have added an estimate or $estimateTimeout expires then push another notification with the final result
* Allow members time to discuss and update their estimate based on the discussion.
*	Once consensus is reached or estimate manager has closed the estimation, report results back to the team
* Application analytics

## Game Rules:
* Teams need created before games
  * Are composed of players
  * Play planning poker games
* Games
  * Can be created by anyone
  * Games take a team of players
  * If you create a game you are a game owner
  * If you get a game to play in your queue, lucky you!
* Game Queue
  * Each player on a team will get a game added to their queue
  * When a game is accepted or deleted by the game owner, it will be removed from queue
* Game Play
  * If you are not the game owner
    * Playing part of a game will set the queue status to Partially Played
    * Completing all stories in a game will set the queue status to Played
 *  If you are the game owner
    * Accepting a game
      * Removes it from other players queues, but it will remain in your game list
      * Reveals the cards to all the players
    * Adding stories to a game
      * Sets the status on all players queues to "Stories Added - Play"
    * Deleting a game
      * Will remove it entirely from moderation list,
      * Will remove it from players queues
