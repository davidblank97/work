<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/sched/global/is_residue_chipper_enabled">
		<xsl:copy-of select="."/>
		<is_layer_diameter_detection_enabled>0</is_layer_diameter_detection_enabled>
		<layer_diameter_lift_gap>0</layer_diameter_lift_gap>
		<layer_diameter_touch_gap>0</layer_diameter_touch_gap>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>