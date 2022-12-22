module AmazingStore
  module Spree
    module Product
      module AddSearchkick
        def self.prepended(base)
          unless base.respond_to?(:searchkick_index)
            base.searchkick
          end
        end

        def search_data
          {
            name: name,
            description: description,
            sku: sku,
          }
        end

        def should_index?
          kept? &&
          available?
        end

        ::Spree::Product.prepend self
      end
    end
  end
end
