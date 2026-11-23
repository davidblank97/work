<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='272654']"/>
	<xsl:template match="/Parameters/param[@id='272655']"/>
  	<xsl:template match="/Parameters">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<param id="272654">
				<name>HEAT INPUT HIGH FAULT</name>
				<short_name>HEAT INPUT HIGH FAULT</short_name>
				<desc>The tolerance value that creates the upper limit of HEAT INPUT HIGH. If the measured value sample falls outside of this band it immediately ends the weld and raises an error message.</desc>
			</param>
			<param id="272655">
				<name>HEAT INPUT LOW FAULT</name>
				<short_name>HEAT INPUT LOW FAULT</short_name>
				<desc>The tolerance value that creates the upper limit of HEAT INPUT LOW. If the measured value sample falls outside of this band it immediately ends the weld and raises an error message.</desc>
			</param>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>