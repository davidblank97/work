<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<!-- FILE TYPE: SCH -->
	<xsl:template match="/language[@localeID='en-CA' and @fileType='SCH']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="44">
				<text>There are no weld heads marked as active. Please select at least one active weld head using the administrative settings.</text>
				<desc>There is no weld heads marked as active. The user must mark at least one weld head as active before a schedule can be created.</desc>
			</str>
			<str id="45">
				<text>The head has a hot wire feeder but the power supply does not have support for it.</text>
				<desc>The weld head configuration file indicates that it has a hot wire feeder. But the power supply configuration file indicated that there is no support for hotwire.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/language[@fileType='SYS']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="36">
				<text>The file %1 failed to export to a USB.</text>
				<desc>%1 = File Name.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<!-- Any new messages should be added to all language files independent of locale.
	Once translated a different xsl will update independent locale files-->
	<xsl:template match="/language[@fileType='AXI']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="29">
				<text>Axis is currently performing a programmed move.</text>
				<desc>Detail to be added to another message.</desc>
			</str>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>