<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='should_validate_chainset_signature']">
		<xsl:copy-of select="."/>
		<preference tag="should_validate_weldhead_signature" value="false"/>
	</xsl:template>

	<xsl:template match="/user_preferences/preference[@tag='should_latch_mig_gun_trigger_press']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/user_preferences/preference[@tag='power_supply_serial_number']"/>
			<xsl:otherwise>
				<preference tag="power_supply_serial_number" value=""/>
			</xsl:otherwise>
		</xsl:choose>
		<preference tag="should_soft_pendant_show_advanced_motion_options" value="true"/>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>