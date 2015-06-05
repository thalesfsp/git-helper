'use strict';

/**
 * @author Thales Pinheiro
 * @since 05/28/2015
 * @copyright Thales Pinheiro
 * @requires nodegit
 * @see https://github.com/thalesfsp/git-helper
 * @description A JS library to help with basic Git commands
 * @todo add others functionalities
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
       */
      add: function(name, url) {
        Repository.then(function(repository) {
          return Git.Remote.create(repository, name, url);
        });
      },

      /**
       * Remove the given remote
       * @param {String} name the remote's name
       */
      remove: function(name) {
        Repository.then(function(repository) {
          return Git.Remote.delete(repository, name);
        });
      },

      /**
       * List and printout all remotes
       * @param {Function} callback with the list of remotes
       */
      list: function(callback) {
        Repository.then(function(repository) {
          Git.Remote.list(repository).then(function(remotes) {
            callback(remotes);
          });
        });
      },

      /**
       * Update the given remote
       * @param {String} name the remote's name
       * @param {String} url the remote's url
       */
      update: function(name, url) {
        Repository.then(function(repository) {
          Git.Remote.lookup(repository, name).then(function(remote) {
            remote.setUrl(url);
            remote.save();
          }, function() {
            Git.Remote.create(repository, name, url);
          });
        });
      }
    }
  };
};
