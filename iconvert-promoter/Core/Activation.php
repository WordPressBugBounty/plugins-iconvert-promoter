<?php
namespace CSPromo\Core;

use CSPromo\Core\PostTypes\PromoPopupsSetup;
use KPromo\Flags;

class Activation {

	public function __construct() {
		register_activation_hook( ICONVERTPR_PAGE_FILE, array( $this, 'onActivate' ) );
	}

	public function onActivate() {
		PromoPopupsSetup::register();
		flush_rewrite_rules();

		$is_pro = strpos( ICONVERTPR_PAGE_FILE, 'iconvert-promoter-pro' ) !== false;
		$this->setActivationTimestamp( $is_pro );
	}

	public function setActivationTimestamp( $is_pro = false ) {
		$key = $is_pro ? 'pro_activation_time' : 'activation_time';

		if ( ! Flags::get( $key ) ) {
			Flags::set( $key, time() );
		}
	}
}
