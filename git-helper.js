'use strict';

/**
 * @author Thales Pinheiro
 * @since 05/28/2015
 * @copyright Thales Pinheiro
 * @see https://github.com/thalesfsp/git-helper
 * A JS library to help with basic Git commands
 */

var Git = require('nodegit');

module.exports = function(repositoryPath) {
  // If no path was not specified, use from the current directory
  if (!repositoryPath) {
    repositoryPath = '.git/';
  }

  // Initialize the Repository objhect
  var Repository = Git.Repository.open(repositoryPath);

  return {
    remote: {
      /**
       * Add the given remote
       * @param {String} name the remote's name
       * @param {String} url the remote's url
       * @param {Function} [cb] callback the result of the operation
       */
      add: function(name, url, cb) {
        Repository.then(function(repository) {
          Git.Remote.create(repository, name, url).then(function(result) {
            if (cb) {
              cb(result);
            }
          });
        });
      },

      /**
       * Remove the given remote
       * @param {String} name the remote's name
       * @param {Function} [cb] callback the result of the operation
       */
      remove: function(name, cb) {
        Repository.then(function(repository) {
          Git.Remote.delete(repository, name).then(function(result) {
            if (cb) {
              cb(result);
            }
          });
        });
      },

      /**
       * List and printout all remotes
       * @param {Function} [cb] callback list of remotes. If specified, the output will be supressed
       */
      list: function(cb) {
        Repository.then(function(repository) {
          Git.Remote.list(repository).then(function(remotes) {
            if (cb) {
              cb(remotes);
            } else {
              console.log(remotes);
            }
          });
        });
      },

      /**
       * Update the given remote
       * @param {String} name the remote's name
       * @param {Object} options update options
       * @param {Boolean} [options.force] if true, will delete and recreate the remote
       * @param {String} options.url the remote url
       * @param {Function} [options.cb] callback the result of the operation
       * @returns {Number} 0 means success
       */
      update: function(name, options) {
        if (options.hasOwnProperty('force')) {
          this.delete(name);
          this.create(name, options.url);

          return;
        }

        Repository.then(function(repository) {
          Git.Remote.lookup(repository, name).then(function(remote) {
            remote.setUrl(options.url);

            if (options.cb) {
              options.cb(remote.save());
            } else {
              return remote.save();
            }
          });
        });
      }
    }
  };
};
