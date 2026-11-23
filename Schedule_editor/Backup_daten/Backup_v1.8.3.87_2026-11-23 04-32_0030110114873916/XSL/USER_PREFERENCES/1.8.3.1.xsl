<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='should_use_motion_median_filter']" />
	<xsl:template match="/user_preferences/preference[@tag='should_use_motion_moving_average_filter']" />
	<xsl:template match="/user_preferences/preference[@tag='should_use_power_supply_median_filter']" />
	<xsl:template match="/user_preferences/preference[@tag='should_use_power_supply_moving_average_filter']" />
	<xsl:template match="/user_preferences/preference[@tag='data_sampler_motion_moving_average']" />

	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>