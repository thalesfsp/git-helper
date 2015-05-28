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
  if (!repositoryPath) {
    repositoryPath = '.git/';
  }

  var Repository = Git.Repository.open(repositoryPath);

  return {
    remote: {
      create: function(name, url, cb) {
        Repository.then(function(repository) {
          Git.Remote.create(repository, name, url).then(function(result) {
            if (cb) {
              cb(result);
            }
          });
        });
      },

      delete: function(name, cb) {
        Repository.then(function(repository) {
          Git.Remote.delete(repository, name).then(function(result) {
            if (cb) {
              cb(result);
            }
          });
        });
      },

      list: function(cb) {
        console.log(Repository);
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

      update: function(name, url, cb) {
        Repository.then(function(repository) {
          Git.Remote.lookup(repository, name).then(function(remote) {
            remote.setUrl(url);

            if (cb) {
              cb(remote.save());
            } else {
              return remote.save();
            }
          });
        });
      }
    }
  };
};
