<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;

class CountDownItemBlock extends BlockBase {

	const OUTER  = 'outer';
	const TEXT   = 'text';
	const NUMBER = 'number';
	public function __construct( $block, $autoload = true ) {
		parent::__construct( $block, $autoload );
	}

	public function computed() {
		return;
	}

	public function mapPropsToElements() {
		$itemName         = $this->getAttribute( 'itemName' );
		$itemType         = $this->getAttribute( 'itemType' );
		$itemDisplay      = $this->getAttribute( 'itemDisplay' );
		$currentShowLabel = $this->getAttribute( 'currentLabelShow' );
		$itemShowLabel    = $currentShowLabel === true ? '' : 'countdown-hide-part-label';

		return array(
			self::OUTER  => array(
				'className'     => array( "item-display-span-{$itemDisplay}", $itemShowLabel ),
				'data-itemname' => "{$itemName}",
				'data-itemtype' => "{$itemType}",
			),
			self::NUMBER => array(
				'innerHTML' => '00',
			),
			self::TEXT   => array(
				'innerHTML' => $itemName,
			),
		);
	}
}


Registry::registerBlock( __DIR__, CountDownItemBlock::class );
